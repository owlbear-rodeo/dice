import { isPlainObject } from "is-plain-object";

import { DiceStyle } from "./DiceStyle";
import { DiceType } from "./DiceType";

export interface Die {
  id: string;
  style: DiceStyle;
  type: DiceType;
}

export function isDie(value: any): value is Die {
  return isPlainObject(value) && typeof value.id === "string";
}
