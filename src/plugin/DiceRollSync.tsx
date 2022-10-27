import OBR from "owlbear-rodeo-sdk";
import { useEffect, useMemo } from "react";
import { useDiceRollStore } from "../dice/store";
import { getPluginId } from "./getPluginId";

/** Sync the current dice roll to the plugin */
export function DiceRollSync() {
  const rollValues = useDiceRollStore((state) => state.rollValues);
  const roll = useDiceRollStore((state) => state.roll);
  const finishedRolling = useMemo(() => {
    const values = Object.values(rollValues);
    if (values.length === 0) {
      return false;
    } else {
      return values.every((value) => value !== null);
    }
  }, [rollValues]);

  // Share the current roll
  useEffect(() => {
    if (roll) {
      OBR.player.setMetadata(getPluginId("roll"), roll);
    } else {
      OBR.player.setMetadata(getPluginId("roll"), undefined);
    }
  }, [roll]);

  // Set the roll metadata values once the roll is finished
  useEffect(() => {
    // Get the roll values within the effect to avoid the need to
    // use it as a dependency
    const values = useDiceRollStore.getState().rollValues;
    const transforms = useDiceRollStore.getState().rollTransforms;
    if (finishedRolling) {
      OBR.player.setMetadata(getPluginId("rollValues"), values);
      OBR.player.setMetadata(getPluginId("rollTransforms"), transforms);
    } else {
      OBR.player.setMetadata(getPluginId("rollValues"), undefined);
      OBR.player.setMetadata(getPluginId("rollTransforms"), undefined);
    }
  }, [finishedRolling]);

  // Listen to dice transform changes and create a custom OBR interaction for the roll
  useEffect(() => {
    let mounted = true;
    let unsubscribeFromStore: (() => void) | null = null;
    let stopInteraction: (() => void) | null = null;

    const transforms = useDiceRollStore.getState().rollTransforms;
    if (roll && !finishedRolling && Object.keys(transforms).length > 0) {
      OBR.interaction
        .startCustomInteraction(transforms)
        .then(([update, stop, id]) => {
          if (!mounted) {
            stop();
            return;
          }
          // Set an interaction metadata field so other players know
          // what interaction to listen to
          OBR.player.setMetadata(getPluginId("interaction"), id);
          stopInteraction = stop;
          unsubscribeFromStore = useDiceRollStore.subscribe((state) => {
            update((draft) => {
              for (const [id, transform] of Object.entries(
                state.rollTransforms
              )) {
                draft[id] = transform;
              }
            });
          });
        });
    }

    return () => {
      mounted = false;
      unsubscribeFromStore?.();
      stopInteraction?.();
      OBR.player.setMetadata(getPluginId("interaction"), undefined);
    };
  }, [finishedRolling, roll]);

  return null;
}
