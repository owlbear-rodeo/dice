import * as THREE from "three";
import { PhysicalMaterial } from "../types/PhysicalMaterial";
import { WeightClass } from "../types/WeightClass";

import * as heavyDice from "./heavy/dice";
import * as heavyLeather from "./heavy/leather";
import * as heavyWood from "./heavy/wood";
import * as heavyShake from "./heavy/shake";
import * as lightDice from "./light/dice";
import * as lightLeather from "./light/leather";
import * as lightWood from "./light/wood";
import * as mediumDice from "./medium/dice";
import * as mediumLeather from "./medium/leather";
import * as mediumWood from "./medium/wood";
import * as mediumShake from "./medium/shake";

const buffers: Record<WeightClass, Record<PhysicalMaterial, AudioBuffer[]>> = {
  HEAVY: {
    DICE: [],
    LEATHER: [],
    WOOD: [],
    SHAKE: [],
  },
  LIGHT: {
    DICE: [],
    LEATHER: [],
    WOOD: [],
    SHAKE: [],
  },
  MEDIUM: {
    DICE: [],
    LEATHER: [],
    WOOD: [],
    SHAKE: [],
  },
};

/**
 * A mapping of weigh class and material to the current index.
 * Used to by the `getNextBuffer` function.
 */
const indices: Record<WeightClass, Record<PhysicalMaterial, number>> = {
  HEAVY: {
    DICE: 0,
    LEATHER: 0,
    WOOD: 0,
    SHAKE: 0,
  },
  LIGHT: {
    DICE: 0,
    LEATHER: 0,
    WOOD: 0,
    SHAKE: 0,
  },
  MEDIUM: {
    DICE: 0,
    LEATHER: 0,
    WOOD: 0,
    SHAKE: 0,
  },
};

function loadBuffer(
  url: string,
  weightClass: WeightClass,
  physicalMaterial: PhysicalMaterial,
  audioLoader: THREE.AudioLoader
) {
  audioLoader.load(url, function (buffer) {
    buffers[weightClass][physicalMaterial].push(buffer);
  });
}

function loadBuffers() {
  const audioLoader = new THREE.AudioLoader();

  loadBuffer(heavyDice.a1, "HEAVY", "DICE", audioLoader);
  loadBuffer(heavyDice.a2, "HEAVY", "DICE", audioLoader);
  loadBuffer(heavyDice.a3, "HEAVY", "DICE", audioLoader);
  loadBuffer(heavyDice.a4, "HEAVY", "DICE", audioLoader);
  loadBuffer(heavyLeather.a1, "HEAVY", "LEATHER", audioLoader);
  loadBuffer(heavyLeather.a2, "HEAVY", "LEATHER", audioLoader);
  loadBuffer(heavyLeather.a3, "HEAVY", "LEATHER", audioLoader);
  loadBuffer(heavyLeather.a4, "HEAVY", "LEATHER", audioLoader);
  loadBuffer(heavyWood.a1, "HEAVY", "WOOD", audioLoader);
  loadBuffer(heavyWood.a2, "HEAVY", "WOOD", audioLoader);
  loadBuffer(heavyWood.a3, "HEAVY", "WOOD", audioLoader);
  loadBuffer(heavyWood.a4, "HEAVY", "WOOD", audioLoader);
  loadBuffer(heavyShake.a1, "HEAVY", "SHAKE", audioLoader);

  loadBuffer(lightDice.a1, "LIGHT", "DICE", audioLoader);
  loadBuffer(lightDice.a2, "LIGHT", "DICE", audioLoader);
  loadBuffer(lightDice.a3, "LIGHT", "DICE", audioLoader);
  loadBuffer(lightDice.a4, "LIGHT", "DICE", audioLoader);
  loadBuffer(lightLeather.a1, "LIGHT", "LEATHER", audioLoader);
  loadBuffer(lightLeather.a2, "LIGHT", "LEATHER", audioLoader);
  loadBuffer(lightLeather.a3, "LIGHT", "LEATHER", audioLoader);
  loadBuffer(lightLeather.a4, "LIGHT", "LEATHER", audioLoader);
  loadBuffer(lightWood.a1, "LIGHT", "WOOD", audioLoader);
  loadBuffer(lightWood.a2, "LIGHT", "WOOD", audioLoader);
  loadBuffer(lightWood.a3, "LIGHT", "WOOD", audioLoader);
  loadBuffer(lightWood.a4, "LIGHT", "WOOD", audioLoader);

  loadBuffer(mediumDice.a1, "MEDIUM", "DICE", audioLoader);
  loadBuffer(mediumDice.a2, "MEDIUM", "DICE", audioLoader);
  loadBuffer(mediumDice.a3, "MEDIUM", "DICE", audioLoader);
  loadBuffer(mediumDice.a4, "MEDIUM", "DICE", audioLoader);
  loadBuffer(mediumLeather.a1, "MEDIUM", "LEATHER", audioLoader);
  loadBuffer(mediumLeather.a2, "MEDIUM", "LEATHER", audioLoader);
  loadBuffer(mediumLeather.a3, "MEDIUM", "LEATHER", audioLoader);
  loadBuffer(mediumLeather.a4, "MEDIUM", "LEATHER", audioLoader);
  loadBuffer(mediumWood.a1, "MEDIUM", "WOOD", audioLoader);
  loadBuffer(mediumWood.a2, "MEDIUM", "WOOD", audioLoader);
  loadBuffer(mediumWood.a3, "MEDIUM", "WOOD", audioLoader);
  loadBuffer(mediumWood.a4, "MEDIUM", "WOOD", audioLoader);
  loadBuffer(mediumShake.a1, "MEDIUM", "SHAKE", audioLoader);

  window.removeEventListener("click", loadBuffers);
}

window.addEventListener("click", loadBuffers);

export function getAudioBuffers(
  weightClass: WeightClass,
  physicalMaterial: PhysicalMaterial
) {
  return buffers[weightClass][physicalMaterial];
}

export function getRandomBuffer(
  weightClass: WeightClass,
  physicalMaterial: PhysicalMaterial
) {
  const buffers = getAudioBuffers(weightClass, physicalMaterial);
  if (buffers.length === 0) {
    return null;
  }
  return buffers[Math.floor(Math.random() * buffers.length)];
}

/**
 * Get an audio buffer for a given weight class and material ensuring that
 * every consecutive call returns the next buffer in the array
 */
export function getNextBuffer(
  weightClass: WeightClass,
  physicalMaterial: PhysicalMaterial
) {
  const buffers = getAudioBuffers(weightClass, physicalMaterial);
  if (buffers.length === 0) {
    return null;
  }
  const index = indices[weightClass][physicalMaterial];
  const buffer = buffers[index];
  indices[weightClass][physicalMaterial] = (index + 1) % buffers.length;
  return buffer;
}
