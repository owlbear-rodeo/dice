import { Player } from "owlbear-rodeo-sdk";
import { useMemo } from "react";
import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import { DiceRoll } from "../types/DiceRoll";
import { DiceThrow } from "../types/DiceThrow";
import { DiceTransform } from "../types/DiceTransform";
import { getPluginId } from "./getPluginId";

export function usePlayerDice(player?: Player) {
  const diceRoll = useMemo(() => {
    return player?.metadata[getPluginId("roll")] as DiceRoll | undefined;
  }, [player]);

  const rollThrows = useMemo(() => {
    return player?.metadata[getPluginId("rollThrows")] as
      | Record<string, DiceThrow>
      | undefined;
  }, [player]);

  const rollValues = useMemo(() => {
    return player?.metadata[getPluginId("rollValues")] as
      | Record<string, number | null>
      | undefined;
  }, [player]);

  const rollTransforms = useMemo(() => {
    return player?.metadata[getPluginId("rollTransforms")] as
      | Record<string, DiceTransform | null>
      | undefined;
  }, [player]);

  const finishedRollValues = useMemo(() => {
    if (!rollValues) {
      return undefined;
    }
    const values: Record<string, number> = {};
    for (const [id, value] of Object.entries(rollValues)) {
      if (value !== null) {
        values[id] = value;
      }
    }
    return values;
  }, [rollValues]);

  const finalValue = useMemo(() => {
    if (diceRoll && finishedRollValues) {
      return getCombinedDiceValue(diceRoll, finishedRollValues);
    } else {
      return null;
    }
  }, [diceRoll, finishedRollValues]);

  return {
    diceRoll,
    rollThrows,
    rollValues,
    rollTransforms,
    finalValue,
    finishedRollValues,
  };
}
