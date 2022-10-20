import { Die } from "../types/Die";

import { DiceMesh } from "../meshes/DiceMesh";
import { DiceMaterial } from "../materials/DiceMaterial";

export function Dice({
  die,
  ...props
}: JSX.IntrinsicElements["group"] & { die: Die }) {
  return (
    <DiceMesh diceType={die.type} {...props}>
      <DiceMaterial diceStyle={die.style} />
    </DiceMesh>
  );
}
