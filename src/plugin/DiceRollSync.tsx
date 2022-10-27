import OBR from "owlbear-rodeo-sdk";
import { useEffect, useMemo } from "react";
import { useDiceRollStore } from "../dice/store";
import { getPluginId } from "./getPluginId";

/** Sync the current dice roll to the plugin */
export function DiceRollSync() {
  const rollValues = useDiceRollStore((state) => state.rollValues);
  const finishedRolling = useMemo(() => {
    const values = Object.values(rollValues);
    if (values.length === 0) {
      return false;
    } else {
      return values.every((value) => value !== null);
    }
  }, [rollValues]);

  useEffect(() => {
    // Get the roll values within the effect to avoid the need to
    // use it as a dependency
    const values = useDiceRollStore.getState().rollValues;
    const roll = useDiceRollStore.getState().roll;
    const transforms = useDiceRollStore.getState().rollTransforms;
    if (finishedRolling) {
      OBR.player.setMetadata(getPluginId("roll"), roll);
      OBR.player.setMetadata(getPluginId("rollValues"), values);
      OBR.player.setMetadata(getPluginId("rollTransforms"), transforms);
    } else {
      OBR.player.setMetadata(getPluginId("roll"), undefined);
      OBR.player.setMetadata(getPluginId("rollValues"), undefined);
      OBR.player.setMetadata(getPluginId("rollTransforms"), undefined);
    }
  }, [finishedRolling]);

  return null;
}
