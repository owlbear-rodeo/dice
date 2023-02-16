import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { DicePreview } from "../previews/DicePreview";

import ResetIcon from "@mui/icons-material/RestartAltRounded";
import ExpandIcon from "@mui/icons-material/ExpandLessRounded";

import { getDiceToRoll, useDiceControlsStore } from "./store";
import { useDiceRollStore } from "../dice/store";
import { useEffect, useMemo, useRef } from "react";
import { DiceType } from "../types/DiceType";

export function DiceQuickRoll() {
  const openDiceDialog = useDiceControlsStore((state) => state.openDiceDialog);

  const startRoll = useDiceRollStore((state) => state.startRoll);

  const counts = useDiceControlsStore((state) => state.diceCounts);
  const defaultDiceCounts = useDiceControlsStore(
    (state) => state.defaultDiceCounts
  );

  const diceById = useDiceControlsStore((state) => state.diceById);

  const hidden = useDiceControlsStore((state) => state.diceHidden);
  const bonus = useDiceControlsStore((state) => state.diceBonus);
  const setBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);
  const handleDiceCountIncrease = useDiceControlsStore(
    (state) => state.incrementDieCount
  );
  const resetDiceCounts = useDiceControlsStore(
    (state) => state.resetDiceCounts
  );

  function handleRoll() {
    const dice = getDiceToRoll(counts, advantage, diceById);
    startRoll({ dice, bonus, hidden });
    handleReset();
  }

  function handleReset() {
    resetDiceCounts();
    setBonus(0);
    setAdvantage(null);
  }

  const isDefault = useMemo(
    () =>
      Object.entries(defaultDiceCounts).every(
        ([type, count]) => counts[type as DiceType] === count
      ),
    [counts, defaultDiceCounts]
  );

  const dockRef = useRef<HTMLDivElement>(null);
  // Scroll dock with Y and X direction wheel events
  useEffect(() => {
    const scroll = dockRef.current;
    if (scroll) {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        if (Math.abs(event.deltaY) !== 0) {
          scroll.scrollBy({ left: event.deltaY });
        }
        if (Math.abs(event.deltaX) !== 0) {
          scroll.scrollBy({ left: event.deltaX });
        }
      };
      scroll.addEventListener("wheel", handleWheel);
      return () => {
        scroll.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  return (
    <Paper
      sx={{
        borderRadius: "16px",
        m: 1,
        p: 0.5,
        backgroundColor: "rgba(34, 38, 57, 0.8)",
      }}
      elevation={1}
    >
      <Stack>
        {/* Roll button */}
        {!isDefault && (
          <Stack position="relative" direction="row">
            <Button fullWidth onClick={handleRoll} variant="outlined">
              Roll
            </Button>
            <Stack sx={{ position: "absolute", top: 0, right: 0 }}>
              <Tooltip title="Reset" disableInteractive>
                <IconButton onClick={handleReset} size="small">
                  <ResetIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        )}
        <Stack direction="row" alignItems="flex-end">
          <IconButton onClick={openDiceDialog}>
            <ExpandIcon />
          </IconButton>
          <Stack
            ref={dockRef}
            sx={{
              overflowX: "auto",
              pt: isDefault ? undefined : 1,
              "::-webkit-scrollbar": { display: "none" },
              flexGrow: 1,
            }}
          >
            <Stack
              direction="row"
              sx={{
                m: "0 auto",
              }}
            >
              {Object.entries(counts).map(([id, count]) => {
                const die = diceById[id];
                if (!die) {
                  return null;
                }
                return (
                  <Badge
                    badgeContent={count}
                    sx={{
                      ".MuiBadge-badge": {
                        bgcolor: "background.default",
                        backgroundImage:
                          "linear-gradient(rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.30))",
                      },
                    }}
                    overlap="circular"
                    key={id}
                  >
                    <IconButton
                      onClick={() => handleDiceCountIncrease(id)}
                      sx={{ p: "0.5px" }}
                    >
                      <DicePreview diceStyle={die.style} diceType={die.type} />
                    </IconButton>
                  </Badge>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
