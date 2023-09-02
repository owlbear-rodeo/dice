import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import HiddenOnIcon from "@mui/icons-material/VisibilityOffRounded";
import HiddenOffIcon from "@mui/icons-material/VisibilityRounded";

import { useDiceControlsStore } from "./store";
import { useDiceRollStore } from "../dice/store";

export function DiceHidden() {
  const hidden = useDiceControlsStore((state) => state.diceHidden);
  const toggleDiceHidden = useDiceControlsStore(
    (state) => state.toggleDiceHidden
  );

  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const roll = useDiceRollStore((state) => state.roll);
  function clearRollIfNeeded() {
    if (roll) {
      clearRoll();
    }
  }

  return (
    <Tooltip
      title={hidden ? "Show Roll" : "Hide Roll"}
      placement="top"
      disableInteractive
    >
      <IconButton
        onClick={() => {
          toggleDiceHidden();
          clearRollIfNeeded();
        }}
      >
        {hidden ? <HiddenOnIcon /> : <HiddenOffIcon />}
      </IconButton>
    </Tooltip>
  );
}
