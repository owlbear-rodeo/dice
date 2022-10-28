import { Html } from "@react-three/drei";
import { useState } from "react";
import { DieMenu } from "../controls/DieMenu";
import { CanvasBridge } from "../helpers/CanvasBridge";
import { DiceThrow } from "../types/DiceThrow";
import { DiceTransform } from "../types/DiceTransform";
import { Die } from "../types/Die";
import { PhysicsDice } from "./PhysiscsDice";

export function InteractiveDice(
  props: JSX.IntrinsicElements["group"] & {
    die: Die;
    dieThrow: DiceThrow;
    dieValue: number | null;
    onRollFinished?: (
      id: string,
      number: number,
      transform: DiceTransform
    ) => void;
  }
) {
  const [showMenu, setShowMenu] = useState(false);

  function handleClick() {
    if (props.dieValue !== null) {
      setShowMenu((prev) => !prev);
    }
  }

  return (
    <PhysicsDice onClick={handleClick} {...props}>
      {showMenu && (
        <Html>
          <CanvasBridge>
            <DieMenu die={props.die} onClose={() => setShowMenu(false)} />
          </CanvasBridge>
        </Html>
      )}
    </PhysicsDice>
  );
}
