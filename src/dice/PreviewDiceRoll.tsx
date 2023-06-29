import { useEffect, useMemo, useRef, useState } from "react";
import { getDiceToRoll, useDiceControlsStore } from "../controls/store";
import { DiceType } from "../types/DiceType";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { DiceRoll } from "../types/DiceRoll";
import { Dice } from "./Dice";
import { DiceThrower } from "../helpers/DiceThrower";
import { DiceVector3 } from "../types/DiceVector3";
import { DiceQuaternion } from "../types/DiceQuaternion";

import { useFrame, useThree } from "@react-three/fiber";
import { Die } from "../types/Die";

export function PreviewDiceRoll() {
  const counts = useDiceControlsStore((state) => state.diceCounts);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const diceById = useDiceControlsStore((state) => state.diceById);
  const defaultDiceCounts = useDiceControlsStore(
    (state) => state.defaultDiceCounts
  );

  const diceRoll = useMemo<DiceRoll>(() => {
    return { dice: getDiceToRoll(counts, advantage, diceById) };
  }, [counts, advantage, diceById]);

  const dice = useMemo(() => getDieFromDice(diceRoll), [diceRoll]);

  const [diceThrower] = useState(() => new DiceThrower());
  const isDefault = useMemo(
    () =>
      Object.entries(defaultDiceCounts).every(
        ([type, count]) => counts[type as DiceType] === count
      ),
    [counts, defaultDiceCounts]
  );
  useEffect(() => {
    if (isDefault) {
      diceThrower.clearHistory();
    }
  }, [isDefault, diceThrower]);

  return (
    <group position={[0, -1, 0]}>
      {dice.map((die, index) => {
        const dieThrow = diceThrower.getDiceThrow(index);
        const p = dieThrow.position;
        const r = dieThrow.rotation;
        return <AnimatedDice key={index} die={die} p={p} r={r} />;
      })}
    </group>
  );
}

function AnimatedDice({
  die,
  p,
  r,
}: {
  die: Die;
  p: DiceVector3;
  r: DiceQuaternion;
}) {
  const { invalidate } = useThree();

  const groupRef = useRef<THREE.Group>(null);

  const [seed] = useState(() => Math.random());

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (group) {
      const t = clock.getElapsedTime();
      const q = lerp(10, 20, seed);
      group.rotation.y = Math.sin(t * q + q) / 10;
      group.rotation.x = Math.sin(t * q + q) / 40;
      group.rotation.z = Math.sin(t * q + q) / 80;
      if (group.scale.x < 1) {
        group.scale.setScalar(Math.min(group.scale.x + delta * 5, 1));
      }
      invalidate();
    }
  });

  return (
    <group ref={groupRef} position={[p.x, p.y, p.z]} scale={0}>
      <Dice
        userData={{ dieId: die.id }}
        die={die}
        quaternion={[r.x, r.y, r.z, r.w]}
      />
    </group>
  );
}

function lerp(from: number, to: number, alpha: number): number {
  return from * (1 - alpha) + to * alpha;
}
