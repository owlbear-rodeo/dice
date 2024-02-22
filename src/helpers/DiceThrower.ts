import { DiceThrow } from "../types/DiceThrow";
import { DiceQuaternion } from "../types/DiceQuaternion";
import { DiceVector3 } from "../types/DiceVector3";

import { random } from "./random";

const MIN_X = -0.3;
const MAX_X = 0.3;
const MIN_Y = 1;
const MAX_Y = 1.2;
const MIN_Z = -0.8;
const MAX_Z = 0.8;
const MIN_LAUNCH_VELOCITY = 1;
const MAX_LAUNCH_VELOCITY = 2;
const MIN_ANGULAR_VELOCITY = 2;
const MAX_ANGULAR_VELOCITY = 6;

export function randomPosition(): DiceVector3 {
  return {
    x: random(MIN_X, MAX_X),
    y: random(MIN_Y, MAX_Y),
    z: random(MIN_Z, MAX_Z),
  };
}

/** Adapted from https://stackoverflow.com/a/56794499 */
export function randomRotation(): DiceQuaternion {
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
export function randomLinearVelocity(
  position: DiceVector3,
  speedMultiplier?: number
): DiceVector3 {
  // Only use the horizontal plane
  const { x, z } = position;
  // Normalize the position to get the direction to [0, 0, 0]
  const length = Math.sqrt(x * x + z * z);
  if (isNaN(length) || length === 0) {
    return { x: 0, y: 0, z: 0 };
  }
  const norm: DiceVector3 = { x: x / length, y: 0, z: z / length };
  // Generate a random speed
  const speed =
    random(MIN_LAUNCH_VELOCITY, MAX_LAUNCH_VELOCITY) * (speedMultiplier || 1);
  // Map the speed to the normalized direction and reverse it so it
  // goes inwards instead of outwards
  const velocity: DiceVector3 = {
    x: norm.x * speed * -1,
    y: norm.y * speed * -1,
    z: norm.z * speed * -1,
  };

  return velocity;
}

export function randomLinearVelocityFromDirection(
  direction: DiceVector3,
  speedMultiplier?: number
): DiceVector3 {
  const speed =
    random(MIN_LAUNCH_VELOCITY, MAX_LAUNCH_VELOCITY) * (speedMultiplier || 1);
  const velocity: DiceVector3 = {
    x: direction.x * speed,
    y: direction.y * speed,
    z: direction.z * speed,
  };

  return velocity;
}

export function randomAngularVelocity(): DiceVector3 {
  return {
    x: random(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
    y: random(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
    z: random(MIN_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY),
  };
}

export function getRandomDiceThrow(speedMultiplier?: number): DiceThrow {
  const position = randomPosition();
  const rotation = randomRotation();
  const linearVelocity = randomLinearVelocity(position, speedMultiplier);
  const angularVelocity = randomAngularVelocity();
  return {
    position,
    rotation,
    linearVelocity,
    angularVelocity,
  };
}

/** A dice thrower that keeps a history of previous dice to avoid collisions */
export class DiceThrower {
  private history: DiceThrow[] = [];

  private isPositionValid(position: DiceVector3) {
    for (const diceThrow of this.history) {
      const a = position;
      const b = diceThrow.position;
      const delta: DiceVector3 = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
      const lenSquared =
        delta.x * delta.x + delta.y * delta.y + delta.z * delta.z;
      const distance = Math.sqrt(lenSquared);
      if (distance < 0.25) {
        return false;
      }
    }
    return true;
  }

  getDiceThrow(index: number): DiceThrow {
    if (this.history.length > index) {
      return this.history[index];
    }
    let position = randomPosition();
    for (let i = 0; i < 50; i++) {
      if (this.isPositionValid(position)) {
        break;
      }
      position = randomPosition();
    }
    const rotation = randomRotation();
    const linearVelocity = randomLinearVelocity(position);
    const angularVelocity = randomAngularVelocity();

    const diceThrow: DiceThrow = {
      position,
      rotation,
      linearVelocity,
      angularVelocity,
    };

    this.history.push(diceThrow);

    return diceThrow;
  }

  clearHistory() {
    this.history = [];
  }
}
