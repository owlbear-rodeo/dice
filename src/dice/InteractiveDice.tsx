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

const DRAG_HEIGHT = 0.5;
const DRAG_HISTORY_WINDOW_SIZE = 5;

type DragState = { p: { x: number; z: number }; t: number };

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
  /** Keep a history of previous drag positions so we can calculate the throw direction and speed */
  const dragHistoryRef = useRef<DragState[]>([]);

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
            camera.position.y - DRAG_HEIGHT
          )
        );
        // Offset the drag anchor so that the x and y animate to the
        // pointer position
        setDragAnchor({
          x: position.x - dice.position.x,
          y: DRAG_HEIGHT,
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
            let linearVelocity: DiceVector3;
            const { direction, speed } = findDragVelocity(
              dragHistoryRef.current
            );
            if (direction && speed) {
              const speedMultiplier = Math.max(1, Math.min(10, speed * 100));
              linearVelocity = randomLinearVelocityFromDirection(
                { x: direction.x, y: 0, z: direction.z },
                speedMultiplier
              );
            } else {
              linearVelocity = randomLinearVelocity(position);
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
          // Find pointer location in world space
          const x = Math.min(Math.max(e.offsetX, 0), size.width);
          const y = Math.min(Math.max(e.offsetY, 0), size.height);
          pointer.x = (x / size.width) * 2 - 1;
          pointer.y = -((y / size.height) * 2 - 1);
          raycaster.setFromCamera(pointer, camera);
          const position = raycaster.ray.origin.add(
            raycaster.ray.direction.multiplyScalar(
              camera.position.y - DRAG_HEIGHT
            )
          );

          // Offset initial anchor position
          const newDiceX = position.x - dragAnchor.x;
          const newDiceZ = position.z - dragAnchor.z;

          // Push to history
          const history = dragHistoryRef.current;
          history.push({
            p: {
              x: newDiceX,
              z: newDiceZ,
            },
            t: performance.now(),
          });
          if (history.length > DRAG_HISTORY_WINDOW_SIZE) {
            history.shift();
          }

          dice.position.set(newDiceX, dice.position.y, newDiceZ);
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

/** Find the average direction and speed of a drag history */
function findDragVelocity(history: DragState[]) {
  if (history.length > 1) {
    let avgDx = 0;
    let avgDz = 0;
    let avgSpeed = 0;
    for (let i = 0; i < history.length - 2; i++) {
      const curr = history[i];
      const next = history[i + 1];

      const dx = next.p.x - curr.p.x;
      const dz = next.p.z - curr.p.z;
      const dt = next.t - curr.t;

      const vx = dx / dt;
      const vz = dz / dt;
      const speed = Math.sqrt(vx * vx + vz * vz);

      avgDx += dx;
      avgDz += dz;
      avgSpeed += speed;
    }
    avgDx / history.length;
    avgDz / history.length;
    avgSpeed / history.length;

    const deltaLength = Math.sqrt(avgDx * avgDx + avgDz * avgDz);
    if (!isNaN(deltaLength) && deltaLength !== 0) {
      // Normalize drag delta
      const direction = {
        x: avgDx / deltaLength,
        z: avgDz / deltaLength,
      };
      return { direction, speed: avgSpeed };
    }
  }

  return { direction: undefined, speed: undefined };
}
