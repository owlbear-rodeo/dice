import { DiceRoll } from "./DiceRoll";
import { InteractiveDice } from "./InteractiveDice";
import { useDiceRollStore } from "./store";

/** Dice roll based off of the values from the dice roll store */
export function InteractiveDiceRoll() {
  const roll = useDiceRollStore((state) => state.roll);
  const rollThrows = useDiceRollStore((state) => state.rollThrows);
  const rollValues = useDiceRollStore((state) => state.rollValues);
  const rollTransforms = useDiceRollStore((state) => state.rollTransforms);
  const finishDieRoll = useDiceRollStore((state) => state.finishDieRoll);

  if (!roll) {
    return null;
  }

  return (
    <DiceRoll
      roll={roll}
      rollThrows={rollThrows}
      rollValues={rollValues}
      rollTransforms={rollTransforms}
      onRollFinished={finishDieRoll}
      Dice={InteractiveDice}
    />
  );
}
