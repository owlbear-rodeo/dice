import { Physics } from "@react-three/rapier";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { TrayColliders } from "../colliders/TrayColliders";
import { DiceRoll as DiceRollType } from "../types/DiceRoll";
import { DiceThrow } from "../types/DiceThrow";
import { DiceTransform } from "../types/DiceTransform";
import { Die } from "../types/Die";
import { Dice as DefaultDice } from "./Dice";
import { PhysicsDice } from "./PhysicsDice";
import { useDebugStore } from "../debug/store";

export function DiceRoll({
  roll,
  rollThrows,
  onRollFinished,
  finishedTransforms,
  transformsRef,
  Dice,
}: {
  roll: DiceRollType;
  rollThrows: Record<string, DiceThrow>;
  onRollFinished?: (
    id: string,
    number: number,
    transform: DiceTransform
  ) => void;
  finishedTransforms?: Record<string, DiceTransform>;
  /** An updated ref of the current dice transforms */
  transformsRef?: React.MutableRefObject<Record<
    string,
    DiceTransform | null
  > | null>;
  /** Override to provide a custom Dice component  */
  Dice: React.FC<JSX.IntrinsicElements["group"] & { die: Die }>;
}) {
  const allowPhysicsDebug = useDebugStore((state) => state.allowPhysicsDebug);

  const dice = useMemo(() => roll && getDieFromDice(roll), [roll]);

  const emptyCallback = useCallback(() => {}, []);

  /**
   * Because we recreate the physics world every new roll
   * there is a frame where all the rigid bodies need to be created
   * to ensure smooth playback we pause the physics sim until
   * the frame after everything is created
   */
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    if (finishedTransforms) {
      setPaused(true);
    } else {
      requestAnimationFrame(() => {
        setPaused(false);
      });
    }
  }, [finishedTransforms]);

  if (finishedTransforms) {
    // Move to a static dice representation when all dice values have been found
    return (
      <group>
        {dice?.map((die) => {
          const dieTransform = finishedTransforms[die.id]!;
          const p = dieTransform.position;
          const r = dieTransform.rotation;
          return (
            <Dice
              userData={{ dieId: die.id }}
              key={die.id}
              die={die}
              position={[p.x, p.y, p.z]}
              quaternion={[r.x, r.y, r.z, r.w]}
            />
          );
        })}
      </group>
    );
  } else {
    // If we have physics states for the dice then create a Rapier physics
    // instance for this roll.
    // We need to re-create the physics world on every new roll as the dice
    // networking relies on the deterministic nature of Rapier when given the
    // same inputs and using the same number of update timesteps.
    return (
      <Physics
        colliders={false}
        interpolate={false}
        timeStep={1 / 120}
        debug={allowPhysicsDebug}
        updateLoop="independent"
        paused={paused}
      >
        <TrayColliders />
        {dice?.map((die) => {
          const dieThrow = rollThrows[die.id];
          // Use a fixed transform if we have it
          // This allows re-rolling of individual dice as
          // we can lock the dice that are already in the tray
          const fixedTransform = transformsRef?.current?.[die.id] || undefined;
          return (
            <PhysicsDice
              key={die.id}
              die={die}
              dieThrow={dieThrow}
              onRollFinished={onRollFinished}
              fixedTransform={fixedTransform}
            >
              {/* Override onClick event to make sure simulated dice can't be selected */}
              <Dice
                die={die}
                onClick={emptyCallback}
                onPointerDown={emptyCallback}
              />
            </PhysicsDice>
          );
        })}
      </Physics>
    );
  }
}

DiceRoll.defaultProps = {
  Dice: DefaultDice,
};
