import { useMemo } from "react";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { DiceRollFrameloop } from "./DiceRollFrameloop";
import { InteractiveDice } from "./InteractiveDice";
import { useDiceRollStore } from "./store";

export function DiceRoll() {
  const roll = useDiceRollStore((state) => state.roll);
  const throws = useDiceRollStore((state) => state.rollThrows);
  const values = useDiceRollStore((state) => state.rollValues);
  const finishDieRoll = useDiceRollStore((state) => state.finishDieRoll);

  const dice = useMemo(() => roll && getDieFromDice(roll), [roll]);

  const allDiceValid = useMemo(() => {
    return dice && dice.every((die) => die.id in throws && die.id in values);
  }, [dice, throws, values]);

  return (
    <group>
      {allDiceValid &&
        dice?.map((die) => (
          <InteractiveDice
            key={die.id}
            die={die}
            dieThrow={throws[die.id]}
            dieValue={values[die.id]}
            onRollFinished={finishDieRoll}
          />
        ))}
      <DiceRollFrameloop rollValues={values} />
    </group>
  );
}
