import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import HistoryIcon from "@mui/icons-material/SavedSearchRounded";
import NoHistoryIcon from "@mui/icons-material/ManageSearchRounded";

import { useDiceRollStore } from "../dice/store";
import { RecentRoll, useDiceHistoryStore } from "./history";
import { DicePreview } from "../previews/DicePreview";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { getDiceToRoll, useDiceControlsStore } from "./store";

export function DiceHistory() {
  const startRoll = useDiceRollStore((state) => state.startRoll);

  const hidden = useDiceControlsStore((state) => state.diceHidden);
  const setBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);
  const resetDiceCounts = useDiceControlsStore(
    (state) => state.resetDiceCounts
  );

  function handleRoll(roll: RecentRoll) {
    const dice = getDiceToRoll(roll.counts, roll.advantage, roll.diceById);
    startRoll({ dice, bonus: roll.bonus, hidden });
    resetDiceCounts();
    setBonus(0);
    setAdvantage(null);
    handleClose();
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  const recentRolls = useDiceHistoryStore((state) => state.recentRolls);
  const removeRecentRoll = useDiceHistoryStore(
    (state) => state.removeRecentRoll
  );

  return (
    <>
      <Tooltip title="History" placement="top" disableInteractive>
        <IconButton
          id="history-button"
          aria-controls={open ? "history-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <HistoryIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="history-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "history-button",
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <Stack width="200px" px={1} gap={0.5}>
          {recentRolls.map((recentRoll, index) => (
            <RecentRollChip
              key={index}
              recentRoll={recentRoll}
              onRoll={() => handleRoll(recentRoll)}
              onDelete={() => removeRecentRoll(index)}
            />
          ))}
          {recentRolls.length === 0 && <EmptyMessage />}
        </Stack>
      </Menu>
    </>
  );
}

function RecentRollChip({
  recentRoll,
  onRoll,
  onDelete,
}: {
  recentRoll: RecentRoll;
  onRoll: () => void;
  onDelete: () => void;
}) {
  return (
    <Chip
      sx={{
        flexGrow: 1,
        flexBasis: 0,
        ".MuiChip-deleteIcon": {
          position: "absolute",
          right: 0,
        },
      }}
      label={
        <Stack direction="row" alignItems="center" gap={0.5} px={2}>
          {Object.entries(recentRoll.counts).map(([id, count]) => {
            const die = recentRoll.diceById[id];
            if (!die || count === 0) {
              return null;
            }
            return (
              <Stack key={id} direction="row" alignItems="center" gap={0.25}>
                {count}{" "}
                <DicePreview
                  diceStyle={die.style}
                  diceType={die.type}
                  size="small"
                />
              </Stack>
            );
          })}
          {recentRoll.bonus !== 0 && (
            <span>
              {recentRoll.bonus > 0 && "+"}
              {recentRoll.bonus}
            </span>
          )}
          {recentRoll.advantage !== null && (
            <span>{recentRoll.advantage === "ADVANTAGE" ? "Adv" : "Dis"}</span>
          )}
        </Stack>
      }
      variant="filled"
      onClick={() => onRoll()}
      onDelete={() => onDelete()}
    />
  );
}

function EmptyMessage() {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 0.5,
        pb: 1,
      }}
    >
      <Box
        component="div"
        sx={{
          fontSize: "2rem",
          color:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.46)"
              : "rgba(0, 0, 0, 0.46)",
          display: "flex",
          p: 1,
        }}
      >
        <NoHistoryIcon />
      </Box>
      <Typography variant="h6">No History</Typography>
      <Typography variant="caption" textAlign="center">
        Roll dice to add to the roll history.
      </Typography>
    </Stack>
  );
}
