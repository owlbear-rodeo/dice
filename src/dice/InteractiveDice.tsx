import { Html } from "@react-three/drei";
import { useState } from "react";
import { DieMenu } from "../controls/DieMenu";
import { CanvasBridge } from "../helpers/CanvasBridge";
import { Die } from "../types/Die";
import { Dice } from "./Dice";

/** Custom dice that shows a popup menu when clicked */
export function InteractiveDice(
  props: JSX.IntrinsicElements["group"] & {
    die: Die;
  }
) {
  const [showMenu, setShowMenu] = useState(false);

  function handleClick() {
    setShowMenu((prev) => !prev);
  }

  return (
    <Dice onClick={handleClick} {...props}>
      {showMenu && (
        <Html>
          <CanvasBridge>
            <DieMenu die={props.die} onClose={() => setShowMenu(false)} />
          </CanvasBridge>
        </Html>
      )}
    </Dice>
  );
}
