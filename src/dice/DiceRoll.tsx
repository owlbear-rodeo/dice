import { useMemo } from "react";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { PhysicsDice } from "./PhysiscsDice";
import { useDiceRollStore } from "./store";

export function DiceRoll() {
  const roll = useDiceRollStore((state) => state.roll);
  const dice = useMemo(() => roll && getDieFromDice(roll), [roll]);

  return (
    <>
      {dice?.map((die) => (
        <PhysicsDice key={die.id} die={die} />
      ))}
    </>
  );
}
