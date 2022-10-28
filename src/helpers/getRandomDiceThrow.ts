import { DiceQuaternion } from "../types/DiceQuaternion";
import { DiceThrow } from "../types/DiceThrow";
import { DiceVector3 } from "../types/DiceVector3";

import { random } from "./random";

const MIN_X = -0.2;
const MAX_X = 0.2;
const MIN_Y = 1.5;
const MAX_Y = 1.8;
const MIN_Z = -0.6;
const MAX_Z = 0.6;
const MIN_LAUNCH_VELOCITY = 1;
const MAX_LAUNCH_VELOCITY = 5;
const MIN_ANGULAR_VELOCITY = 5;
const MAX_ANGULAR_VELOCITY = 12;

function randomPosition(): DiceVector3 {
  return {
    x: random(MIN_X, MAX_X),
    y: random(MIN_Y, MAX_Y),
    z: random(MIN_Z, MAX_Z),
  };
}

/** Adapted from https://stackoverflow.com/a/56794499 */
function randomRotation(): DiceQuaternion {
  let x, y, z, u, v, w, s;
  do {
    x = random(-1, 1);
    y = random(-1, 1);
    z = x * x + y * y;
  } while (z > 1);
  do {
    u = random(-1, 1);
    v = random(-1, 1);
    w = u * u + v * v;
  } while (w > 1);
  s = Math.sqrt((1 - z) / w);
  return {
    x,
    y,
    z: s * u,
    w: s * v,
  };
}

/**
 * Get a random launch velocity for the dice
 * Always launches from where the dice is towards the center of the tray
 * This better simulates a throwing motion compared to a complete random velocity
 */
function randomLinearVelocity(position: DiceVector3): DiceVector3 {
  // Only use the horizontal plane
  const { x, z } = position;
  // Normalize the position to get the direction to [0, 0, 0]
  const length = Math.sqrt(x * x + z * z);
  if (isNaN(length) || length === 0) {
    return { x: 0, y: 0, z: 0 };
  }
  const norm: DiceVector3 = { x: x / length, y: 0, z: z / length };
  // Generate a random speed
  const speed = random(MIN_LAUNCH_VELOCITY, MAX_LAUNCH_VELOCITY);
  // Map the speed to the normalized direction and reverse it so it
  // goes inwards instead of outwards
  const velocity: DiceVector3 = {
    x: norm.x * speed * -1,
    y: norm.y * speed * -1,
    z: norm.z * speed * -1,
  };

  return velocity;
}

function randomAngularVelocity(): DiceVector3 {
  return {
    x: random(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
    y: random(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
    z: random(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
  };
}

export function getRandomDiceThrow(): DiceThrow {
  const position = randomPosition();
  const rotation = randomRotation();
  const linearVelocity = randomLinearVelocity(position);
  const angularVelocity = randomAngularVelocity();
  return {
    position,
    rotation,
    linearVelocity,
    angularVelocity,
  };
}
