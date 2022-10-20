import * as THREE from "three";
import { PhysicalMaterial } from "../types/PhysicalMaterial";
import { WeightClass } from "../types/WeightClass";

import * as heavyLeather from "./heavy/leather";
import * as heavyWood from "./heavy/wood";
import * as lightLeather from "./light/leather";
import * as lightWood from "./light/wood";
import * as mediumLeather from "./medium/leather";
import * as mediumWood from "./medium/wood";

const audioLoader = new THREE.AudioLoader();

const buffers: Record<WeightClass, Record<PhysicalMaterial, AudioBuffer[]>> = {
  HEAVY: {
    LEATHER: [],
    WOOD: [],
  },
  LIGHT: {
    LEATHER: [],
    WOOD: [],
  },
  MEDIUM: {
    LEATHER: [],
    WOOD: [],
  },
};

/**
 * A mapping of weigh class and material to the current index.
 * Used to by the `getNextBuffer` function.
 */
const indices: Record<WeightClass, Record<PhysicalMaterial, number>> = {
  HEAVY: {
    LEATHER: 0,
    WOOD: 0,
  },
  LIGHT: {
    LEATHER: 0,
    WOOD: 0,
  },
  MEDIUM: {
    LEATHER: 0,
    WOOD: 0,
  },
};

function loadBuffer(
  url: string,
  weightClass: WeightClass,
  physicalMaterial: PhysicalMaterial
) {
  audioLoader.load(url, function (buffer) {
    buffers[weightClass][physicalMaterial].push(buffer);
  });
}

loadBuffer(heavyLeather.a1, "HEAVY", "LEATHER");
loadBuffer(heavyLeather.a2, "HEAVY", "LEATHER");
loadBuffer(heavyLeather.a3, "HEAVY", "LEATHER");
loadBuffer(heavyLeather.a4, "HEAVY", "LEATHER");
loadBuffer(heavyWood.a1, "HEAVY", "WOOD");
loadBuffer(heavyWood.a2, "HEAVY", "WOOD");
loadBuffer(heavyWood.a3, "HEAVY", "WOOD");
loadBuffer(heavyWood.a4, "HEAVY", "WOOD");
loadBuffer(lightLeather.a1, "LIGHT", "LEATHER");
loadBuffer(lightLeather.a2, "LIGHT", "LEATHER");
loadBuffer(lightLeather.a3, "LIGHT", "LEATHER");
loadBuffer(lightLeather.a4, "LIGHT", "LEATHER");
loadBuffer(lightWood.a1, "LIGHT", "WOOD");
loadBuffer(lightWood.a2, "LIGHT", "WOOD");
loadBuffer(lightWood.a3, "LIGHT", "WOOD");
loadBuffer(lightWood.a4, "LIGHT", "WOOD");
loadBuffer(mediumLeather.a1, "MEDIUM", "LEATHER");
loadBuffer(mediumLeather.a2, "MEDIUM", "LEATHER");
loadBuffer(mediumLeather.a3, "MEDIUM", "LEATHER");
loadBuffer(mediumLeather.a4, "MEDIUM", "LEATHER");
loadBuffer(mediumWood.a1, "MEDIUM", "WOOD");
loadBuffer(mediumWood.a2, "MEDIUM", "WOOD");
loadBuffer(mediumWood.a3, "MEDIUM", "WOOD");
loadBuffer(mediumWood.a4, "MEDIUM", "WOOD");

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
