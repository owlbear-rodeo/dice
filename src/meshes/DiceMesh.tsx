import { DiceType } from "../types/DiceType";
import { RoundedDiceMesh } from "./rounded/RoundedDiceMesh";
import { SharpDiceMesh } from "./sharp/SharpDiceMesh";

export function DiceMesh({
  sharp,
  ...props
}: JSX.IntrinsicElements["group"] & { diceType: DiceType; sharp?: boolean }) {
  if (sharp) {
    return <SharpDiceMesh {...props} />;
  } else {
    return <RoundedDiceMesh {...props} />;
  }
}
