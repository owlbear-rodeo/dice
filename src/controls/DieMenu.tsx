import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from "@mui/material/Fade";

import { RerollDiceIcon } from "../icons/RerollDiceIcon";

import { useDiceRollStore } from "../dice/store";
import { Die } from "../types/Die";
import { DicePreview } from "../previews/DicePreview";

export function DieMenu({ die, onClose }: { die: Die; onClose: () => void }) {
  const value = useDiceRollStore((state) => state.rollValues[die.id]);
  const reroll = useDiceRollStore((state) => state.reroll);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Fade in timeout={100}>
        <Card sx={{ borderRadius: "20px", transform: "translateX(-50%)" }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Tooltip
              title={`${die.style.slice(0, 1)}${die.style
                .slice(1)
                .toLowerCase()} ${die.type}`}
            >
              <div style={{ display: "flex" }}>
                <DicePreview diceStyle={die.style} diceType={die.type} />
              </div>
            </Tooltip>
            <Typography variant="h6">{value}</Typography>
            <Tooltip title="Reroll">
              <IconButton onClick={() => reroll([die.id])}>
                <RerollDiceIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Card>
      </Fade>
    </ClickAwayListener>
  );
}
