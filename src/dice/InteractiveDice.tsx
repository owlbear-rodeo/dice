import { useCallback, useEffect, useRef, useState } from "react";
import { useSpring, animated, config } from "@react-spring/three";
import { ThreeEvent, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { Die } from "../types/Die";
import { Dice } from "./Dice";
import { useDiceRollStore } from "./store";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

/** Custom dice can be dragged to re-roll */
export function InteractiveDice(
  props: JSX.IntrinsicElements["group"] & {
    die: Die;
  }
) {
  const diceRef = useRef<THREE.Group>(null);
  const [dragging, setDragging] = useState(false);

  const { invalidate, camera, size } = useThree();

  let pointerDownPositionRef = useRef({ x: 0, y: 0 });
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    setDragging(true);
    pointerDownPositionRef.current = { x: e.offsetX, y: e.offsetY };
  }, []);

  const reroll = useDiceRollStore((state) => state.reroll);

  useEffect(() => {
    if (dragging) {
      const handleUp = (e: PointerEvent) => {
        setDragging(false);
        const deltaX = Math.abs(pointerDownPositionRef.current.x - e.offsetX);
        const deltaY = Math.abs(pointerDownPositionRef.current.y - e.offsetY);
        const minWidth = Math.max(e.width, 5);
        const minHeight = Math.max(e.height, 5);
        if (deltaX > minWidth || deltaY > minHeight) {
          reroll([props.die.id]);
        }
      };

      const handleMove = (e: PointerEvent) => {
        const dice = diceRef.current;
        if (dragging && dice && e.target instanceof HTMLCanvasElement) {
          const x = Math.min(Math.max(e.offsetX, 0), size.width);
          const y = Math.min(Math.max(e.offsetY, 0), size.height);
          pointer.x = (x / size.width) * 2 - 1;
          pointer.y = -((y / size.height) * 2 - 1);
          raycaster.setFromCamera(pointer, camera);
          const position = raycaster.ray.origin.add(
            raycaster.ray.direction.multiplyScalar(camera.position.y)
          );
          dice.position.set(position.x, dice.position.y, position.z);
          invalidate();
        }
      };
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointermove", handleMove);

      return () => {
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointermove", handleMove);
      };
    }
  }, [
    dragging,
    camera,
    size.width,
    size.height,
    reroll,
    props.die.id,
    invalidate,
  ]);

  useEffect(() => {
    invalidate();
  }, [dragging]);

  const { y } = useSpring({
    y: dragging ? 0.5 : 0,
    onChange: () => {
      invalidate();
    },
    config: dragging ? config.wobbly : config.stiff,
  });

  return (
    <animated.group position-y={y}>
      <Dice onPointerDown={handlePointerDown} ref={diceRef} {...props}></Dice>
    </animated.group>
  );
}
