import { Debug, Physics } from "@react-three/rapier";
import { useMemo } from "react";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { TrayColliders } from "../colliders/TrayColliders";
import { DiceRoll as DiceRollType } from "../types/DiceRoll";
import { DiceThrow } from "../types/DiceThrow";
import { DiceTransform } from "../types/DiceTransform";
import { Die } from "../types/Die";
import { Dice as DefaultDice } from "./Dice";
import { DiceRollFrameloop } from "./DiceRollFrameloop";
import { PhysicsDice } from "./PhysicsDice";
import { useDebugStore } from "../debug/store";

export function DiceRoll({
  roll,
  rollThrows,
  rollValues,
  rollTransforms,
  onRollFinished,
  Dice,
}: {
  roll: DiceRollType;
  rollThrows: Record<string, DiceThrow>;
  rollValues: Record<string, number | null>;
  rollTransforms: Record<string, DiceTransform | null>;
  onRollFinished?: (
    id: string,
    number: number,
    transform: DiceTransform
  ) => void;
  /** Override to provide a custom Dice component  */
  Dice: React.FC<JSX.IntrinsicElements["group"] & { die: Die }>;
}) {
  const allowPhysicsDebug = useDebugStore((state) => state.allowPhysicsDebug);

  const dice = useMemo(() => roll && getDieFromDice(roll), [roll]);

  const allTransformDiceValid = useMemo(() => {
    return dice.every(
      (die) => die.id in rollTransforms && rollTransforms[die.id] !== null
    );
  }, [dice, rollTransforms]);

  const allPhysicsDiceValid = useMemo(() => {
    return dice.every((die) => die.id in rollThrows && die.id in rollValues);
  }, [dice, rollThrows, rollValues]);

  if (allTransformDiceValid) {
    // Move to a static dice representation when all dice values have been found
    return (
      <group>
        {dice?.map((die) => {
          const dieTransform = rollTransforms[die.id]!;
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
  } else if (allPhysicsDiceValid) {
    // If we have physics states for the dice then create a Rapier physics
    // instance for this roll.
    // We need to re-create the physics world on every new roll as the dice
    // networking relies on the deterministic nature of Rapier when given the
    // same inputs and using the same number of update timesteps.
    return (
      <Physics colliders={false}>
        {allowPhysicsDebug && <Debug />}
        <TrayColliders />
        {dice?.map((die) => {
          const dieThrow = rollThrows[die.id];
          const dieValue = rollValues[die.id];
          const dieTransform = rollTransforms[die.id];

          return (
            <PhysicsDice
              key={die.id}
              die={die}
              dieThrow={dieThrow}
              dieTransform={dieTransform}
              dieValue={dieValue}
              onRollFinished={onRollFinished}
            >
              {/* Override onClick event to make sure simulated dice can't be selected */}
              <Dice die={die} onClick={() => {}} />
            </PhysicsDice>
          );
        })}
        <DiceRollFrameloop rollValues={rollValues} />
      </Physics>
    );
  } else {
    return null;
  }
}

DiceRoll.defaultProps = {
  Dice: DefaultDice,
};
