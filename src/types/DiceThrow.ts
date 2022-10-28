import { DiceQuaternion } from "./DiceQuaternion";
import { DiceVector3 } from "./DiceVector3";

export interface DiceThrow {
  position: DiceVector3;
  rotation: DiceQuaternion;
  linearVelocity: DiceVector3;
  angularVelocity: DiceVector3;
}
