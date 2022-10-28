import OBR from "owlbear-rodeo-sdk";
import { useEffect } from "react";
import { useDiceRollStore } from "../dice/store";
import { getPluginId } from "./getPluginId";

/** Sync the current dice roll to the plugin */
export function DiceRollSync() {
  useEffect(() =>
    useDiceRollStore.subscribe((state) => {
      // const values = Object.values(state.rollValues);
      // if (values.length > 0) {
      //   if (
      //     !(
      //       values.every((value) => value === null) ||
      //       values.every((value) => value !== null)
      //     )
      //   ) {
      //     return;
      //   }
      // }
      OBR.player.setMetadata({
        [getPluginId("roll")]: state.roll,
        [getPluginId("rollThrows")]: state.rollThrows,
        [getPluginId("rollValues")]: state.rollValues,
        [getPluginId("rollTransforms")]: state.rollTransforms,
      });
    })
  );

  return null;
}
