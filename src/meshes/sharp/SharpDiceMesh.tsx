import { DiceType } from "../../types/DiceType";

import { D10 } from "./D10";
import { D100 } from "./D100";
import { D12 } from "./D12";
import { D20 } from "./D20";
import { D4 } from "./D4";
import { D6 } from "./D6";
import { D8 } from "./D8";

export function SharpDiceMesh({
  diceType,
  ...props
}: JSX.IntrinsicElements["group"] & { diceType: DiceType }) {
  switch (diceType) {
    case "D4":
      return <D4 {...props} />;
    case "D6":
      return <D6 {...props} />;
    case "D8":
      return <D8 {...props} />;
    case "D10":
      return <D10 {...props} />;
    case "D12":
      return <D12 {...props} />;
    case "D20":
      return <D20 {...props} />;
    case "D100":
      return <D100 {...props} />;
    default:
      throw Error(`Dice type ${diceType} error: not implemented`);
  }
}
