import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { DiceTransform } from "../types/DiceTransform";
import { PhysicsDice } from "./PhysiscsDice";
import { useDiceRollStore } from "./store";

export function DiceRoll() {
  const roll = useDiceRollStore((state) => state.roll);
  const dice = useMemo(() => roll && getDieFromDice(roll), [roll]);

  const updateTransforms = useDiceRollStore((state) => state.updateTransforms);

  const parentRef = useRef<THREE.Group>(null);

  // Update the dice store transform
  const updateDiceTransforms = useCallback(() => {
    const parent = parentRef.current;
    if (parent) {
      const transforms: { id: string; transform: DiceTransform }[] = [];
      for (const child of parent.children) {
        const id = child.userData.dieId;
        if (id) {
          const position = child.position;
          const rotation = child.quaternion;
          const transform = {
            position: { x: position.x, y: position.y, z: position.z },
            rotation: {
              x: rotation.x,
              y: rotation.y,
              z: rotation.z,
              w: rotation.w,
            },
          };
          transforms.push({ id, transform });
        }
      }
      if (transforms.length > 0) {
        updateTransforms(transforms);
      }
    }
  }, [updateTransforms]);

  useFrame(updateDiceTransforms);

  return (
    <group ref={parentRef}>
      {dice?.map((die) => (
        <PhysicsDice key={die.id} die={die} />
      ))}
    </group>
  );
}
