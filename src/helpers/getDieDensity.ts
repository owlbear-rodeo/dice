import { Die } from "../types/Die";

/** Get the density multiplier for a die */
export function getDieDensity(die: Die): number {
  if (die.style === "IRON") {
    return 2;
  } else if (die.style === "WALNUT" || die.style === "GLASS") {
    return 1.5;
  } else {
    return 1;
  }
}
