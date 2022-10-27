import {
  DiceQuaternion,
  DiceTransform,
  DiceVector3,
} from "../types/DiceTransform";
import { random } from "./random";

const MIN_X = -0.2;
const MAX_X = 0.2;
const MIN_Y = 1.5;
const MAX_Y = 1.8;
const MIN_Z = -0.6;
const MAX_Z = 0.6;

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

export function getRandomDiceTransform(): DiceTransform {
  return {
    position: randomPosition(),
    rotation: randomRotation(),
  };
}
