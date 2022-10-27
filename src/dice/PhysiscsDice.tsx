import * as THREE from "three";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  CollisionEnterPayload,
  RigidBody,
  RigidBodyApi,
  Vector3Array,
} from "@react-three/rapier";
import { Html } from "@react-three/drei";

import { Dice } from "./Dice";
import { Die } from "../types/Die";
import { useDiceRollStore } from "./store";
import { getValueFromDiceGroup } from "../helpers/getValueFromDiceGroup";
import { DieMenu } from "../controls/DieMenu";
import { CanvasBridge } from "../helpers/CanvasBridge";
import { useFrame } from "@react-three/fiber";
import { useAudioListener } from "../audio/AudioListenerProvider";
import { getNextBuffer } from "../audio/getAudioBuffer";
import { PhysicalMaterial } from "../types/PhysicalMaterial";
import { getDieWeightClass } from "../helpers/getDieWeightClass";
import { getDieDensity } from "../helpers/getDieDensity";

const MIN_LAUNCH_VELOCITY = 1;
const MAX_LAUNCH_VELOCITY = 5;
const MIN_ANGULAR_VELOCITY = 5;
const MAX_ANGULAR_VELOCITY = 12;
const MIN_X = -0.2;
const MAX_X = 0.2;
const MIN_Y = 1.5;
const MAX_Y = 1.8;
const MIN_Z = -0.6;
const MAX_Z = 0.6;
const MIN_INTERACTION_SPEED = 0.01;
/** Cool down in MS before dice audio can get played again */
const AUDIO_COOLDOWN = 200;

function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function magnitude({ x, y, z }: { x: number; y: number; z: number }) {
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Get a random launch velocity for the dice
 * Always launches from where the dice is towards the center of the tray
 * This better simulates a throwing motion compared to a complete random velocity
 */
function getRandomVelocity(position: Vector3Array): Vector3Array {
  // Only use the horizontal plane
  const [x, _, z] = position;
  // Normalize the position to get the direction to [0, 0, 0]
  const length = Math.sqrt(x * x + z * z);
  if (isNaN(length) || length === 0) {
    return [0, 0, 0];
  }
  const norm: Vector3Array = [x / length, 0, z / length];
  // Generate a random speed
  const speed = randomNumber(MIN_LAUNCH_VELOCITY, MAX_LAUNCH_VELOCITY);
  // Map the speed to the normalized direction and reverse it so it
  // goes inwards instead of outwards
  const velocity = norm.map((coord) => coord * speed * -1) as Vector3Array;
  return velocity;
}

export function PhysicsDice({
  die,
  ...props
}: JSX.IntrinsicElements["group"] & {
  die: Die;
}) {
  const rollValue = useDiceRollStore((state) => state.rollValues[die.id]);
  const updateValue = useDiceRollStore((state) => state.updateValue);
  const updateTransform = useDiceRollStore((state) => state.updateTransform);
  const ref = useRef<THREE.Group>(null);
  const rigidBodyRef = useRef<RigidBodyApi>(null);

  // Generator initial random position, rotation and velocities
  const position = useMemo<Vector3Array>(
    () => [
      randomNumber(MIN_X, MAX_X),
      randomNumber(MIN_Y, MAX_Y),
      randomNumber(MIN_Z, MAX_Z),
    ],
    []
  );
  const rotation = useMemo<Vector3Array>(
    () => [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ],
    []
  );
  const linearVelocity = useMemo<Vector3Array>(
    () => getRandomVelocity(position),
    [position]
  );
  const angularVelocity = useMemo<Vector3Array>(
    () => [
      randomNumber(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
      randomNumber(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
      randomNumber(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
    ],
    []
  );

  const checkRollFinished = useCallback(() => {
    const rigidBody = rigidBodyRef.current;
    const group = ref.current;
    if (rigidBody && rollValue === null && group) {
      // Update the dice store transform
      const position = rigidBody.translation();
      const rotation = rigidBody.rotation();
      updateTransform(die.id, {
        position: { x: position.x, y: position.y, z: position.z },
        rotation: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
          w: rotation.w,
        },
      });

      // Get the total speed for the dice
      const linVel = rigidBody.linvel();
      const angVel = rigidBody.angvel();
      const speed = magnitude(linVel) + magnitude(angVel);
      // Ensure that the dice is in the tray
      const validPosition = rigidBody.translation().y < MIN_Y;
      if (speed < MIN_INTERACTION_SPEED && validPosition) {
        updateValue(die.id, getValueFromDiceGroup(group));
        // Disable rigid body rotation and translation
        // This stops the dice from getting changed after it has finished rolling
        rigidBody.setEnabledRotations(false, false, false);
        rigidBody.setAngvel({ x: 0, y: 0, z: 0 });
        rigidBody.setEnabledTranslations(false, false, false);
        rigidBody.setLinvel({ x: 0, y: 0, z: 0 });
      }
    }
  }, [updateValue, updateTransform, die.id, rollValue]);

  useFrame(checkRollFinished);

  const [showMenu, setShowMenu] = useState(false);

  function handleClick() {
    const rigidBody = rigidBodyRef.current;
    if (rigidBody) {
      const linVel = rigidBody.linvel();
      const angVel = rigidBody.angvel();
      const speed =
        Math.abs(linVel.x + linVel.y + linVel.z) +
        Math.abs(angVel.x + angVel.y + angVel.z);
      if (speed < MIN_INTERACTION_SPEED) {
        setShowMenu((prev) => !prev);
      }
    }
  }

  const listener = useAudioListener();
  const lastAudioTimeRef = useRef(0);
  function handleCollision({ rigidBodyObject }: CollisionEnterPayload) {
    if (performance.now() - lastAudioTimeRef.current < AUDIO_COOLDOWN) {
      return;
    }
    const group = ref.current;
    // TODO: remove conditional when this gets merged https://github.com/pmndrs/react-three-rapier/pull/151/commits
    const physicalMaterial: PhysicalMaterial =
      rigidBodyObject?.userData?.material || "LEATHER";
    const linvel = rigidBodyRef.current?.linvel();
    if (group && physicalMaterial && linvel) {
      const speed = magnitude(linvel);
      const weightClass = getDieWeightClass(die);
      const buffer = getNextBuffer(weightClass, physicalMaterial);
      if (buffer) {
        const sound = new THREE.PositionalAudio(listener);
        sound.setBuffer(buffer);
        sound.setRefDistance(3);
        sound.play();
        // Modulate sound volume based off of the speed of the colliding dice
        sound.setVolume(Math.min(speed / 5, 1));
        sound.onEnded = () => {
          group.remove(sound);
        };
        group.add(sound);
        lastAudioTimeRef.current = performance.now();
      }
    }
  }

  return (
    <RigidBody
      colliders="hull"
      // Increase gravity on the dice to offset the non-standard dice size.
      // Dice are around 10x larger then they should be to account for
      // physics errors when shown at proper size.
      gravityScale={2}
      density={getDieDensity(die)}
      friction={0.1}
      position={position}
      rotation={rotation}
      linearVelocity={linearVelocity}
      angularVelocity={angularVelocity}
      ref={rigidBodyRef}
      onCollisionEnter={handleCollision}
      userData={{ material: "DICE" }}
    >
      <group ref={ref} onClick={handleClick}>
        <Dice die={die} {...props} />
        {showMenu && (
          <Html>
            <CanvasBridge>
              <DieMenu die={die} onClose={() => setShowMenu(false)} />
            </CanvasBridge>
          </Html>
        )}
      </group>
    </RigidBody>
  );
}
