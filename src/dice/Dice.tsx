import { Die } from "../types/Die";

import { DiceMesh } from "../meshes/DiceMesh";
import { DiceMaterial } from "../materials/DiceMaterial";

export function Dice({
  die,
  children,
  ...props
}: JSX.IntrinsicElements["group"] & { die: Die }) {
  return (
    <DiceMesh diceType={die.type} {...props} sharp={die.style === "WALNUT"}>
      <DiceMaterial diceStyle={die.style} />
      {children}
    </DiceMesh>
  );
}
