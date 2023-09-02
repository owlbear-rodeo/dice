import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { useTheme, keyframes } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/CloseRounded";
import HiddenIcon from "@mui/icons-material/VisibilityOffRounded";
import RollIcon from "@mui/icons-material/ArrowForwardRounded";

import { RerollDiceIcon } from "../icons/RerollDiceIcon";

import { GradientOverlay } from "./GradientOverlay";
import { useDiceRollStore } from "../dice/store";
import { DiceResults } from "./DiceResults";
import { getDiceToRoll, useDiceControlsStore } from "./store";
import { DiceType } from "../types/DiceType";
import { useDiceHistoryStore } from "./history";
import { Die } from "../types/Die";

const jiggle = keyframes`
0% { transform: translate(0, 0) rotate(0deg); }
25% { transform: translate(2px, 2px) rotate(2deg); }
50% { transform: translate(0, 0) rotate(0deg); }
75% { transform: translate(-2px, 2px) rotate(-2deg); }
100% { transform: translate(0, 0) rotate(0deg); }
`;

export function DiceRollControls() {
  const defaultDiceCounts = useDiceControlsStore(
    (state) => state.defaultDiceCounts
  );

  const counts = useDiceControlsStore((state) => state.diceCounts);
  const bonus = useDiceControlsStore((state) => state.diceBonus);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  // Is currently the default dice state (all counts 0 and advantage/bonus defaults)
  const isDefault = useMemo(
    () =>
      Object.entries(defaultDiceCounts).every(
        ([type, count]) => counts[type as DiceType] === count
      ) &&
      advantage === null &&
      bonus === 0,
    [counts, defaultDiceCounts, advantage, bonus]
  );

  const rollValues = useDiceRollStore((state) => state.rollValues);
  const finishedRolling = useMemo(() => {
    const values = Object.values(rollValues);
    if (values.length === 0) {
      return false;
    } else {
      return values.every((value) => value !== null);
    }
  }, [rollValues]);

  if (!isDefault) {
    return (
      <Fade in>
        <span>
          <DicePickedControls />
        </span>
      </Fade>
    );
  } else if (finishedRolling) {
    return (
      <Fade in>
        <span>
          <FinishedRollControls />
        </span>
      </Fade>
    );
  } else {
    return null;
  }
}

function DicePickedControls() {
  const startRoll = useDiceRollStore((state) => state.startRoll);

  const defaultDiceCounts = useDiceControlsStore(
    (state) => state.defaultDiceCounts
  );
  const diceById = useDiceControlsStore((state) => state.diceById);
  const counts = useDiceControlsStore((state) => state.diceCounts);
  const hidden = useDiceControlsStore((state) => state.diceHidden);
  const bonus = useDiceControlsStore((state) => state.diceBonus);
  const setBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);

  const resetDiceCounts = useDiceControlsStore(
    (state) => state.resetDiceCounts
  );

  const pushRecentRoll = useDiceHistoryStore((state) => state.pushRecentRoll);

  function handleRoll() {
    if (hasDice && rollPressTime) {
      const dice = getDiceToRoll(counts, advantage, diceById);
      const activeTimeSeconds = (performance.now() - rollPressTime) / 1000;
      const speedMultiplier = Math.max(1, Math.min(10, activeTimeSeconds * 2));
      startRoll({ dice, bonus, hidden }, speedMultiplier);

      const rolledDiceById: Record<string, Die> = {};
      for (const id of Object.keys(counts)) {
        if (!(id in rolledDiceById)) {
          rolledDiceById[id] = diceById[id];
        }
      }
      pushRecentRoll({ advantage, counts, bonus, diceById: rolledDiceById });

      handleReset();
    }
    setRollPressTime(null);
  }

  function handleReset() {
    resetDiceCounts();
    setBonus(0);
    setAdvantage(null);
  }

  const rollPressTime = useDiceControlsStore(
    (state) => state.diceRollPressTime
  );
  const setRollPressTime = useDiceControlsStore(
    (state) => state.setDiceRollPressTime
  );

  function handlePointerDown() {
    setRollPressTime(performance.now());
  }

  useEffect(() => {
    if (rollPressTime) {
      const handlePointerUp = () => {
        setRollPressTime(null);
      };
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [rollPressTime]);

  const hasDice = useMemo(
    () =>
      !Object.entries(defaultDiceCounts).every(
        ([type, count]) => counts[type as DiceType] === count
      ),
    [counts, defaultDiceCounts]
  );

  const theme = useTheme();

  return (
    <>
      <ButtonBase
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          cursor: hasDice ? "pointer" : "",
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          ":focus": {
            outline: 0,
          },
          ":hover #dice-roll-button": hasDice
            ? {
                color: theme.palette.primary.contrastText,
                width: "100px",
                "& span": {
                  transform: "translateX(0)",
                },
                backgroundColor: theme.palette.primary.main,
              }
            : {},
          ":active #dice-roll-button": hasDice
            ? {
                backgroundColor: theme.palette.primary.dark,
              }
            : {},
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handleRoll}
        aria-label="roll"
        disabled={!hasDice}
      >
        <Box
          component="div"
          sx={{
            ":active": {
              animation: `${jiggle} 0.3s infinite`,
            },
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Button
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: hasDice ? "transparent" : "transparent !important",
              "& span": {
                transform: "translate(-23px)",
                color: theme.palette.primary.contrastText,
                transition: theme.transitions.create("transform"),
              },
              transition: theme.transitions.create([
                "width",
                "color",
                "background-color",
              ]),
              minWidth: 0,
              width: "36px",
              overflow: "hidden",
              borderRadius: "20px",
            }}
            endIcon={<RollIcon />}
            variant="contained"
            disabled={!hasDice}
            id="dice-roll-button"
            // @ts-ignore
            component="div"
          >
            Roll
          </Button>
        </Box>
      </ButtonBase>
      <GradientOverlay top />
      <Stack
        sx={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Tooltip title="Clear" disableInteractive>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack
        sx={{
          position: "absolute",
          top: 12,
          left: 24,
        }}
      >
        {advantage && (
          <Typography
            textAlign="left"
            lineHeight="40px"
            color="white"
            variant="h6"
          >
            {advantage === "ADVANTAGE" ? "Adv" : "Dis"}
          </Typography>
        )}
      </Stack>
      <Stack
        sx={{
          position: "absolute",
          top: 12,
          right: 24,
        }}
      >
        {bonus !== 0 && (
          <Typography
            textAlign="right"
            variant="h6"
            lineHeight="40px"
            color="white"
          >
            {bonus > 0 && "+"}
            {bonus}
          </Typography>
        )}
      </Stack>
    </>
  );
}

function FinishedRollControls() {
  const roll = useDiceRollStore((state) => state.roll);
  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const reroll = useDiceRollStore((state) => state.reroll);

  const rollValues = useDiceRollStore((state) => state.rollValues);
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
      <GradientOverlay top height={resultsExpanded ? 500 : undefined} />
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
              sx={{ pointerEvents: "all", color: "white" }}
            >
              <RerollDiceIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear" sx={{ pointerEvents: "all" }}>
            <IconButton
              onClick={() => clearRoll()}
              sx={{ pointerEvents: "all", color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
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
        {roll && (
          <DiceResults
            diceRoll={roll}
            rollValues={finishedRollValues}
            expanded={resultsExpanded}
            onExpand={setResultsExpanded}
          />
        )}
        {roll?.hidden && (
          <Tooltip title="Hidden Roll" sx={{ pointerEvents: "all" }}>
            <HiddenIcon htmlColor="white" />
          </Tooltip>
        )}
      </Stack>
    </>
  );
}
