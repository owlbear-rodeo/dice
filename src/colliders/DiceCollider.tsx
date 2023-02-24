import { DiceType } from "../types/DiceType";
import { D10Collider } from "./D10Collider";
import { D12Collider } from "./D12Collider";
import { D20Collider } from "./D20Collider";
import { D4Collider } from "./D4Collider";
import { D6Collider } from "./D6Collider";
import { D8Collider } from "./D8Collider";

export function DiceCollider({ diceType }: { diceType: DiceType }) {
  switch (diceType) {
    case "D4":
      return <D4Collider />;
    case "D6":
      return <D6Collider />;
    case "D8":
      return <D8Collider />;
    case "D10":
      return <D10Collider />;
    case "D12":
      return <D12Collider />;
    case "D20":
      return <D20Collider />;
    case "D100":
      return <D10Collider />;
    default:
      throw Error(`Dice type ${diceType} error: not implemented`);
  }
}
