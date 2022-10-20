import { Die } from "../types/Die";
import { WeightClass } from "../types/WeightClass";

export function getDieWeightClass(die: Die): WeightClass {
  if (die.style === "IRON") {
    if (die.type === "D4") {
      return "MEDIUM";
    } else {
      return "HEAVY";
    }
  } else {
    if (die.type === "D4") {
      return "LIGHT";
    } else {
      return "MEDIUM";
    }
  }
}
