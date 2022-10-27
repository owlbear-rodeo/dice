import { Player } from "owlbear-rodeo-sdk";
import { useMemo } from "react";
import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import { DiceRoll } from "../types/DiceRoll";
import { DiceTransform } from "../types/DiceTransform";
import { getPluginId } from "./getPluginId";

export function usePlayerDice(player?: Player) {
  const diceRoll = useMemo(() => {
    return player?.metadata[getPluginId("roll")] as DiceRoll | undefined;
  }, [player]);

  const rollValues = useMemo(() => {
    return player?.metadata[getPluginId("rollValues")] as
      | Record<string, number>
      | undefined;
  }, [player]);

  const rollTransforms = useMemo(() => {
    return player?.metadata[getPluginId("rollTransforms")] as
      | Record<string, DiceTransform>
      | undefined;
  }, [player]);

  const finalValue = useMemo(() => {
    if (diceRoll && rollValues) {
      return getCombinedDiceValue(diceRoll, rollValues);
    } else {
      return null;
    }
  }, [diceRoll, rollValues]);

  return {
    diceRoll,
    rollValues,
    rollTransforms,
    finalValue,
  };
}
