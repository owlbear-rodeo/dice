import { Player } from "owlbear-rodeo-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RenderCallback, useFrame, useThree } from "@react-three/fiber";

import { Dice } from "../dice/Dice";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { useDiceInteraction } from "./useDiceInteraction";
import { usePlayerDice } from "./usePlayerDice";
import { Die } from "../types/Die";
import { DiceTransform } from "../types/DiceTransform";

export function PlayerDice({ player }: { player?: Player }) {
  const { diceRoll, rollTransforms } = usePlayerDice(player);

  const parentRef = useRef<THREE.Group>(null);

  useDiceInteraction(player, parentRef.current);

  return (
    <group ref={parentRef}>
      {diceRoll &&
        getDieFromDice(diceRoll).map((die) => (
          <PossibleInterpolatedDice
            key={die.id}
            die={die}
            transform={rollTransforms?.[die.id]}
          />
        ))}
    </group>
  );
}

/**
 * Create an interpolated dice if the initial transform state is undefined
 */
function PossibleInterpolatedDice({
  die,
  transform,
}: {
  die: Die;
  transform: DiceTransform | undefined;
}) {
  const [initialTransform] = useState(transform);

  if (initialTransform) {
    const p = initialTransform.position;
    const r = initialTransform.rotation;
    return (
      <Dice
        userData={{ dieId: die.id }}
        key={die.id}
        die={die}
        position={[p.x, p.y, p.z]}
        quaternion={[r.x, r.y, r.z, r.w]}
      />
    );
  } else {
    return <InterpolatedDice die={die} transform={transform} />;
  }
}

const INTERP_TIME = 500;
/**
 * Smooth out the transition between the dice interaction
 * and the final dice transform by interpolating to the final value
 * over `INTERP_TIME` ms.
 */
function InterpolatedDice({
  die,
  transform,
}: {
  die: Die;
  transform: DiceTransform | undefined;
}) {
  const { invalidate } = useThree();

  const groupRef = useRef<THREE.Group>(null);

  const transformTimeRef = useRef(performance.now());
  useEffect(() => {
    transformTimeRef.current = performance.now();
  }, [transform]);

  const position = useMemo(() => {
    if (transform) {
      return new THREE.Vector3(
        transform.position.x,
        transform.position.y,
        transform.position.z
      );
    } else {
      return null;
    }
  }, [transform]);

  const quaternion = useMemo(() => {
    if (transform) {
      return new THREE.Quaternion(
        transform.rotation.x,
        transform.rotation.y,
        transform.rotation.z,
        transform.rotation.w
      );
    } else {
      return null;
    }
  }, [transform]);

  const interpolate = useCallback<RenderCallback>(() => {
    const group = groupRef.current;
    if (position && quaternion && group) {
      const deltaTime = performance.now() - transformTimeRef.current;
      const alpha = Math.min(1, deltaTime / INTERP_TIME);
      group.position.lerp(position, alpha);
      group.quaternion.slerp(quaternion, alpha);

      // Continue the interpolation as long as we need
      if (deltaTime <= INTERP_TIME) {
        invalidate();
      }
    }
  }, [position, quaternion]);

  useFrame(interpolate);

  return (
    <group
      userData={{ dieId: die.id }}
      ref={groupRef}
      position={[0, -100, 0]} // Default position out of frame
    >
      <Dice die={die} />
    </group>
  );
}
