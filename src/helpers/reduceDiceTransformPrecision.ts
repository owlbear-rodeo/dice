import { DiceTransform } from "../types/DiceTransform";

function round(n: number, fractionDigits: number) {
  return parseFloat(n.toFixed(fractionDigits));
}

/** Round a dice transform's numbers to the `fractionDigits` */
export function reduceDiceTransformPrecision(
  transform: DiceTransform,
  fractionDigits = 2
): DiceTransform {
  return {
    position: {
      x: round(transform.position.x, fractionDigits),
      y: round(transform.position.y, fractionDigits),
      z: round(transform.position.z, fractionDigits),
    },
    rotation: {
      x: round(transform.rotation.x, fractionDigits),
      y: round(transform.rotation.y, fractionDigits),
      z: round(transform.rotation.z, fractionDigits),
      w: round(transform.rotation.w, fractionDigits),
    },
  };
}
