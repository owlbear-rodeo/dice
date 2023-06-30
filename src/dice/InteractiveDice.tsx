import { useCallback, useEffect, useRef, useState } from "react";
import { useSpring, animated, config } from "@react-spring/three";
import { ThreeEvent, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { Die } from "../types/Die";
import { Dice } from "./Dice";
import { useDiceRollStore } from "./store";
import { DiceVector3 } from "../types/DiceVector3";
import { DiceThrow } from "../types/DiceThrow";
import {
  randomAngularVelocity,
  randomLinearVelocity,
  randomLinearVelocityFromDirection,
  randomRotation,
} from "../helpers/DiceThrower";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const GRAB_HEIGHT = 0.5;

/** Custom dice can be dragged to re-roll */
export function InteractiveDice(
  props: JSX.IntrinsicElements["group"] & {
    die: Die;
  }
) {
  const diceRef = useRef<THREE.Group>(null);
  const [dragAnchor, setDragAnchor] = useState<DiceVector3 | null>(null);

  const { invalidate, camera, size } = useThree();

  const pointerDownPositionRef = useRef({ x: 0, y: 0 });
  const previousDicePositionRef = useRef({ x: 0, y: 0, z: 0 });
  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const dice = diceRef.current;
      if (dice) {
        // Find the initial drag position
        const x = Math.min(Math.max(e.offsetX, 0), size.width);
        const y = Math.min(Math.max(e.offsetY, 0), size.height);
        pointer.x = (x / size.width) * 2 - 1;
        pointer.y = -((y / size.height) * 2 - 1);
        raycaster.setFromCamera(pointer, camera);
        const position = raycaster.ray.origin.add(
          raycaster.ray.direction.multiplyScalar(
            camera.position.y - GRAB_HEIGHT
          )
        );
        // Offset the drag anchor so that the x and y animate to the
        // pointer position
        setDragAnchor({
          x: position.x - dice.position.x,
          y: GRAB_HEIGHT,
          z: position.z - dice.position.z,
        });

        pointerDownPositionRef.current = { x: e.offsetX, y: e.offsetY };
      }
    },
    [size.width, size.height]
  );

  const reroll = useDiceRollStore((state) => state.reroll);

  useEffect(() => {
    if (dragAnchor) {
      const handleUp = (e: PointerEvent) => {
        setDragAnchor(null);
        const dice = diceRef.current;

        if (dice) {
          const deltaX = Math.abs(pointerDownPositionRef.current.x - e.offsetX);
          const deltaY = Math.abs(pointerDownPositionRef.current.y - e.offsetY);
          const minWidth = Math.max(e.width, 5);
          const minHeight = Math.max(e.height, 5);
          if (deltaX > minWidth || deltaY > minHeight) {
            const position = {
              x: dice.position.x,
              // Fix dice throw position a 1 unit
              y: 1,
              z: dice.position.z,
            };
            // Find the direction of movement
            const { x, z } = position;
            const { x: prevX, z: prevZ } = previousDicePositionRef.current;
            const dx = x - prevX;
            const dz = z - prevZ;
            // Normalize
            const length = Math.sqrt(dx * dx + dz * dz);
            let linearVelocity: DiceVector3;
            if (isNaN(length) || length === 0) {
              linearVelocity = randomLinearVelocity(position);
            } else {
              // Throw in movement direction
              const norm: DiceVector3 = {
                x: dx / length,
                y: 0,
                z: dz / length,
              };
              linearVelocity = randomLinearVelocityFromDirection(norm);
            }
            const diceThrow: DiceThrow = {
              position,
              linearVelocity,
              angularVelocity: randomAngularVelocity(),
              rotation: randomRotation(),
            };
            reroll([props.die.id], { [props.die.id]: diceThrow });
          }
        }
      };

      const handleMove = (e: PointerEvent) => {
        const dice = diceRef.current;
        if (dragAnchor && dice && e.target instanceof HTMLCanvasElement) {
          previousDicePositionRef.current = {
            x: dice.position.x,
            y: dice.position.y,
            z: dice.position.z,
          };

          const x = Math.min(Math.max(e.offsetX, 0), size.width);
          const y = Math.min(Math.max(e.offsetY, 0), size.height);
          pointer.x = (x / size.width) * 2 - 1;
          pointer.y = -((y / size.height) * 2 - 1);
          raycaster.setFromCamera(pointer, camera);
          const position = raycaster.ray.origin.add(
            raycaster.ray.direction.multiplyScalar(
              camera.position.y - GRAB_HEIGHT
            )
          );

          dice.position.set(
            position.x - dragAnchor.x,
            dice.position.y,
            position.z - dragAnchor.z
          );
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
    dragAnchor,
    camera,
    size.width,
    size.height,
    reroll,
    props.die.id,
    invalidate,
  ]);

  useEffect(() => {
    invalidate();
  }, [dragAnchor]);

  const { position } = useSpring({
    position: (dragAnchor
      ? [dragAnchor.x, dragAnchor.y, dragAnchor.z]
      : [0, 0, 0]) as [number, number, number],
    onChange: () => {
      invalidate();
    },
    config: dragAnchor ? config.wobbly : config.stiff,
  });

  return (
    <animated.group position={position}>
      <Dice onPointerDown={handlePointerDown} ref={diceRef} {...props}></Dice>
    </animated.group>
  );
}
