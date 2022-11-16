import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/**
 * Invalidate the frameloop while dice are being rolled.
 * This allows dice physics to work with an on-demand renderer
 */
export function DiceRollFrameloop() {
  const { invalidate } = useThree();

  useEffect(() => {
    let ref = requestAnimationFrame(animate);
    function animate() {
      ref = requestAnimationFrame(animate);
      invalidate();
    }
    return () => {
      cancelAnimationFrame(ref);
    };
  }, [invalidate]);

  return null;
}
