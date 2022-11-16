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
import { useMemo, useState } from "react";
import { DiceResults } from "./DiceResults";

export function DiceRollControls() {
  const roll = useDiceRollStore((state) => state.roll);
  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const rerollAll = useDiceRollStore((state) => state.rerollAll);

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

  return (
    <>
      {roll?.hidden && <GradientOverlay />}
      {/* Unmount controls as soon as we start rolling to save on performance */}
      {finishedRolling && (
        <>
          <Fade in>
            <GradientOverlay top height={resultsExpanded ? 500 : undefined} />
          </Fade>
          <Fade in>
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
                <IconButton
                  onClick={() => rerollAll()}
                  disabled={!finishedRolling}
                  sx={{ pointerEvents: "all" }}
                  aria-label="reroll"
                >
                  <RerollDiceIcon />
                </IconButton>
                {roll && finishedRolling && (
                  <DiceResults
                    diceRoll={roll}
                    rollValues={finishedRollValues}
                    expanded={resultsExpanded}
                    onExpand={setResultsExpanded}
                  />
                )}
                <IconButton
                  onClick={() => clearRoll()}
                  disabled={!finishedRolling}
                  sx={{ pointerEvents: "all" }}
                  aria-label="clear"
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>
          </Fade>
        </>
      )}
      {roll?.hidden && (
        <Stack
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            pointerEvents: "none",
            padding: 3,
            alignItems: "center",
          }}
        >
          <Tooltip title="Hidden Roll" sx={{ pointerEvents: "all" }}>
            <HiddenIcon />
          </Tooltip>
        </Stack>
      )}
    </>
  );
}
