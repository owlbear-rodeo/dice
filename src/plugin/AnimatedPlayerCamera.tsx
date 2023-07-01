import { useMemo } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { DiceTransform } from "../types/DiceTransform";

import { useSpring, animated, config } from "@react-spring/three";
import { useThree } from "@react-three/fiber";

export function AnimatedPlayerCamera({
  rollTransforms,
}: {
  rollTransforms: Record<string, DiceTransform> | undefined;
}) {
  const { invalidate } = useThree();

  const cameraPosition = useMemo<[number, number, number]>(() => {
    if (rollTransforms) {
      const transforms = Object.values(rollTransforms);
      if (transforms.length > 0) {
        const bounds = getBoundingBox(transforms);
        const size = Math.max(bounds.width, bounds.height);
        const x = Math.min(0.8, Math.max(-0.8, bounds.center.x));
        const y = lerp(1, 3, Math.max(Math.min(size, 1), 0));
        const z = Math.min(0.8, Math.max(-0.8, bounds.center.y));
        return [x, y, z];
      } else {
        return [0, 3, 0];
      }
    } else {
      return [0, 3, 0];
    }
  }, [rollTransforms]);

  const { position } = useSpring({
    position: cameraPosition,
    onChange: () => invalidate(),
    config: config.slow,
  });

  return (
    <>
      <animated.group position={position}>
        <PerspectiveCamera
          makeDefault
          fov={28}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </animated.group>
    </>
  );
}

type BoundingBox = {
  min: { x: number; y: number };
  max: { x: number; y: number };
  width: number;
  height: number;
  center: { x: number; y: number };
};

function getBoundingBox(transforms: DiceTransform[]): BoundingBox {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minZ = Number.MAX_SAFE_INTEGER;
  let maxZ = Number.MIN_SAFE_INTEGER;
  for (let t of transforms) {
    minX = t.position.x < minX ? t.position.x : minX;
    maxX = t.position.x > maxX ? t.position.x : maxX;
    minZ = t.position.z < minZ ? t.position.z : minZ;
    maxZ = t.position.z > maxZ ? t.position.z : maxZ;
  }
  let width = maxX - minX;
  let height = maxZ - minZ;
  let center = { x: (minX + maxX) / 2, y: (minZ + maxZ) / 2 };
  return {
    min: { x: minX, y: minZ },
    max: { x: maxX, y: maxZ },
    width,
    height,
    center,
  };
}

function lerp(from: number, to: number, alpha: number): number {
  return from * (1 - alpha) + to * alpha;
}
