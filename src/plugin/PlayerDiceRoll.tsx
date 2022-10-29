import { Player } from "owlbear-rodeo-sdk";

import { usePlayerDice } from "./usePlayerDice";
import { DiceRoll } from "../dice/DiceRoll";

export function PlayerDiceRoll({ player }: { player?: Player }) {
  const { diceRoll, rollThrows, rollValues, rollTransforms } =
    usePlayerDice(player);

  if (!diceRoll || !rollThrows || !rollValues || !rollTransforms) {
    return null;
  }

  return (
    <DiceRoll
      roll={diceRoll}
      rollThrows={rollThrows}
      rollValues={rollValues}
      rollTransforms={rollTransforms}
    />
  );
}
