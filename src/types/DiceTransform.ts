export interface DiceVector3 {
  x: number;
  y: number;
  z: number;
}

export interface DiceQuaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface DiceTransform {
  position: DiceVector3;
  rotation: DiceQuaternion;
}
