import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { useDiceRollStore } from "../dice/store";

/**
 * Invalidate the frameloop while dice are being rolled.
 * This allows dice physics to work with an on-demand renderer
 */
export function DiceRollFrameloop() {
  const { invalidate } = useThree();
  const rollValues = useDiceRollStore((state) => state.rollValues);
  const finishedRolling = useMemo(() => {
    const values = Object.values(rollValues);
    if (values.length === 0) {
      return true;
    } else {
      return values.every((value) => value !== null);
    }
  }, [rollValues]);

  useEffect(() => {
    if (!finishedRolling) {
      let ref = requestAnimationFrame(animate);
      function animate() {
        ref = requestAnimationFrame(animate);
        invalidate();
      }
      return () => {
        cancelAnimationFrame(ref);
      };
    }
  }, [finishedRolling, invalidate]);

  return null;
}
