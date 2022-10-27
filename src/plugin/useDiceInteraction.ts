import OBR, { Player } from "owlbear-rodeo-sdk";
import { useEffect, useMemo } from "react";
import { getPluginId } from "./getPluginId";
import { DiceTransform } from "../types/DiceTransform";
import { useThree } from "@react-three/fiber";

export function useDiceInteraction(
  player: Player | undefined,
  parent: THREE.Group | null
) {
  const { invalidate } = useThree();

  const interactionId = useMemo(() => {
    return player?.metadata[getPluginId("interaction")] as string | undefined;
  }, [player]);

  useEffect(() => {
    if (parent && interactionId) {
      return OBR.interaction.onCustomInteraction<Record<string, DiceTransform>>(
        interactionId,
        (transforms) => {
          for (let child of parent.children) {
            const id = child.userData.dieId;
            const transform = transforms[id];
            if (transform) {
              child.position.set(
                transform.position.x,
                transform.position.y,
                transform.position.z
              );
              child.quaternion.set(
                transform.rotation.x,
                transform.rotation.y,
                transform.rotation.z,
                transform.rotation.w
              );
            }
          }
          // Invalidate frameloop for on demand renderer
          invalidate();
        }
      );
    }
  }, [parent, interactionId, invalidate]);
}
