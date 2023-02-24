import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";

import CloseIcon from "@mui/icons-material/CloseRounded";
import HiddenIcon from "@mui/icons-material/VisibilityOffRounded";

import { RerollDiceIcon } from "../icons/RerollDiceIcon";

import { GradientOverlay } from "./GradientOverlay";
import { useDiceRollStore } from "../dice/store";
import { useEffect, useMemo, useState } from "react";
import { DiceResults } from "./DiceResults";
import { DiceQuickRoll } from "./DiceQuickRoll";
import { useDiceControlsStore } from "./store";

export function DiceRollControls() {
  const roll = useDiceRollStore((state) => state.roll);
  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const reroll = useDiceRollStore((state) => state.reroll);

  const rollValues = useDiceRollStore((state) => state.rollValues);
  const finishedRolling = useMemo(() => {
    const values = Object.values(rollValues);
    if (values.length === 0) {
      return false;
    } else {
      return values.every((value) => value !== null);
    }
  }, [rollValues]);

  const finishedRollValues = useMemo(() => {
    const values: Record<string, number> = {};
    for (const [id, value] of Object.entries(rollValues)) {
      if (value !== null) {
        values[id] = value;
      }
    }
    return values;
  }, [rollValues]);

  const [resultsExpanded, setResultsExpanded] = useState(false);

  const [hovering, setHovering] = useState(true);
  useEffect(() => {
    const tray = document.getElementById("interactive-tray");
    if (tray) {
      // Only allow hover with a mouse
      const startHover = (e: PointerEvent) => {
        if (e.pointerType === "mouse") {
          setHovering(true);
        }
      };
      const stopHover = (e: PointerEvent) => {
        if (e.pointerType === "mouse") {
          setHovering(false);
        }
      };
      tray.addEventListener("pointerenter", startHover);
      tray.addEventListener("pointerleave", stopHover);

      return () => {
        tray.removeEventListener("pointerenter", startHover);
        tray.removeEventListener("pointerleave", stopHover);
      };
    }
  }, []);

  const diceSet = useDiceControlsStore((state) => state.diceSet);
  useEffect(() => {
    setHovering(true);
  }, [diceSet]);

  return (
    <>
      {/* Unmount controls as soon as we start rolling to save on performance */}
      {finishedRolling && (
        <>
          <Fade in>
            <GradientOverlay top height={resultsExpanded ? 500 : undefined} />
          </Fade>
          <Fade in={hovering}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                pointerEvents: "none",
                padding: 3,
              }}
              component="div"
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                alignItems="start"
              >
                <Tooltip title="Reroll" sx={{ pointerEvents: "all" }}>
                  <IconButton
                    onClick={() => reroll()}
                    disabled={!finishedRolling}
                    sx={{ pointerEvents: "all" }}
                  >
                    <RerollDiceIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Clear" sx={{ pointerEvents: "all" }}>
                  <IconButton
                    onClick={() => clearRoll()}
                    disabled={!finishedRolling}
                    sx={{ pointerEvents: "all" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </Fade>
          <Fade in>
            <Stack
              sx={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                padding: 3,
                alignItems: "center",
              }}
              component="div"
            >
              {roll && finishedRolling && (
                <DiceResults
                  diceRoll={roll}
                  rollValues={finishedRollValues}
                  expanded={resultsExpanded}
                  onExpand={setResultsExpanded}
                />
              )}
              {roll?.hidden && (
                <Tooltip title="Hidden Roll" sx={{ pointerEvents: "all" }}>
                  <HiddenIcon />
                </Tooltip>
              )}
            </Stack>
          </Fade>
        </>
      )}
      {(finishedRolling || Object.values(rollValues).length === 0) && (
        <Fade in={hovering}>
          <Stack
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
            }}
          >
            <DiceQuickRoll />
          </Stack>
        </Fade>
      )}
    </>
  );
}
