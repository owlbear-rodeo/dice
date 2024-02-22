import CloseIcon from "@mui/icons-material/CloseRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import ExpandLess from "@mui/icons-material/ExpandLessRounded";
import InfoRounded from "@mui/icons-material/InfoRounded";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { getDiceToRoll, useDiceControlsStore } from "../controls/store";
import { useDiceRollStore } from "../dice/store";
import { Die } from "../types/Die";
import Backdrop from "@mui/material/Backdrop";
import Slide from "@mui/material/Slide";
import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";

const FairnessCharts = lazy(() => import("./FairnessCharts"));

const marks = [
  {
    value: 20,
  },
  {
    value: 100,
    label: "100",
  },
  {
    value: 500,
    label: "500",
  },
  {
    value: 1000,
    label: "1000",
  },
  {
    value: 2000,
    label: "2000",
  },
];

export function FairnessTester() {
  const open = useDiceControlsStore((state) => state.fairnessTesterOpen);
  const toggleOpen = useDiceControlsStore(
    (state) => state.toggleFairnessTester
  );

  const startRoll = useDiceRollStore((state) => state.startRoll);
  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const reroll = useDiceRollStore((state) => state.reroll);
  const diceById = useDiceControlsStore((state) => state.diceById);
  const counts = useDiceControlsStore((state) => state.diceCounts);
  const resetDiceCounts = useDiceControlsStore(
    (state) => state.resetDiceCounts
  );
  const setBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);

  const singleDiceSelected = useMemo(() => {
    const totalCount = Object.values(counts).reduce(
      (prev, curr) => prev + curr
    );
    return totalCount === 1;
  }, [counts]);

  const [numberRolls, setNumberRolls] = useState(500);

  const [active, setActive] = useState(false);

  const [rolledValues, setRolledValues] = useState<number[]>([]);
  const [rolledDie, setRolledDie] = useState<Die | null>(null);

  const [showResults, setShowResults] = useState(false);

  const finished = Boolean(!active && rolledDie);
  const starting = Boolean(!active && !rolledDie);

  function handleStart() {
    setRolledValues([]);

    const rolling = Object.entries(counts).find(([_, value]) => value > 0);
    if (rolling && diceById[rolling[0]]) {
      const rollingDie = diceById[rolling[0]];
      if (rollingDie) {
        setRolledDie(rollingDie);
        const dice = getDiceToRoll(counts, null, diceById);
        startRoll({ dice, bonus: 0, hidden: true });
        setActive(true);
        handleCountsReset();
      }
    }
  }

  function handleStop() {
    setShowResults(true);
    setActive(false);
  }

  function handleRestart() {
    setActive(false);
    setRolledDie(null);
    setRolledValues([]);
    setShowResults(false);
  }

  function handleCountsReset() {
    resetDiceCounts();
    setBonus(0);
    setAdvantage(null);
  }

  // Subscribe to roll finish events and add them to the rolledValues state
  useEffect(() => {
    if (active) {
      return useDiceRollStore.subscribe((state) => {
        const roll = state.roll;
        if (roll && Object.values(state.rollValues).every((v) => v !== null)) {
          const value = getCombinedDiceValue(
            roll,
            state.rollValues as Record<string, number>
          );
          if (value) {
            setRolledValues((prev) => [...prev, value]);
          }
        }
      });
    }
  }, [active, numberRolls]);

  // Reroll if we need or clear the roll if we've reached our rolls
  useEffect(() => {
    if (active && rolledValues.length > 0) {
      if (rolledValues.length >= numberRolls) {
        setActive(false);
        clearRoll();
        setShowResults(true);
      } else {
        reroll();
      }
    }
  }, [active, rolledValues]);

  const theme = useTheme();

  return (
    <>
      <Backdrop open={open && active} invisible />
      <Slide in={open} direction="up" unmountOnExit>
        <Paper
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: 2,
            backgroundColor: active
              ? theme.palette.mode === "light"
                ? "rgba(241, 243, 249, 0.6)"
                : "rgba(30, 34, 49, 0.8)"
              : undefined,
          }}
        >
          <Stack gap={1}>
            <Alerts
              active={active}
              numberRolls={numberRolls}
              rolled={rolledDie !== null}
              singleDiceSelected={singleDiceSelected}
            />
            {rolledDie && (
              <Stack>
                <Button
                  onClick={() => {
                    setShowResults(!showResults);
                  }}
                  size="small"
                  sx={{
                    pt: 1.5,
                    px: 2,
                  }}
                  fullWidth
                >
                  <ExpandLess
                    sx={{
                      position: "absolute",
                      top: "0px",
                      transform: `rotate(${showResults ? "180deg" : "0deg"})`,
                      transition: theme.transitions.create("transform", {
                        duration: theme.transitions.duration.shortest,
                      }),
                    }}
                    fontSize="small"
                  />
                  <Typography variant="caption">Results</Typography>
                </Button>
                <Collapse in={showResults} unmountOnExit>
                  <Stack
                    height={345}
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Suspense fallback={<CircularProgress />}>
                      <FairnessCharts
                        die={rolledDie}
                        numberRolls={numberRolls}
                        rolledValues={rolledValues}
                      />
                    </Suspense>
                  </Stack>
                </Collapse>
              </Stack>
            )}
            {starting && (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" id="rolls-label">
                  Rolls
                </Typography>
                <Tooltip title="Close Tester" disableInteractive>
                  <IconButton onClick={() => toggleOpen()} disabled={active}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
            {starting && (
              <Stack px={1}>
                <Slider
                  aria-labelledby="rolls-label"
                  value={numberRolls}
                  onChange={(_, v) => !Array.isArray(v) && setNumberRolls(v)}
                  min={0}
                  max={2000}
                  defaultValue={500}
                  step={null}
                  valueLabelDisplay="auto"
                  marks={marks}
                  disabled={active}
                />
              </Stack>
            )}
            {active && (
              <Stack gap={1}>
                <LinearProgress
                  sx={{ my: 1, borderRadius: 2 }}
                  id="testing-progress"
                  variant="determinate"
                  value={((rolledValues.length + 1) / numberRolls) * 100}
                />
                <FormLabel htmlFor="testing-progress">
                  {rolledValues.length + 1} of {numberRolls} Rolls
                </FormLabel>
              </Stack>
            )}
            {starting && (
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                test dice fairness by rolling many times
              </Typography>
            )}
            {finished && (
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                {rolledValues.length} of {numberRolls} rolls completed
              </Typography>
            )}
            {starting && (
              <Button
                variant="contained"
                disabled={!singleDiceSelected && numberRolls > 0}
                fullWidth
                onClick={() => handleStart()}
              >
                Start
              </Button>
            )}
            {active && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleStop()}
              >
                Stop
              </Button>
            )}
            {finished && (
              <Stack direction="row" gap={1}>
                <Button
                  variant="outlined"
                  fullWidth
                  endIcon={<InfoRounded />}
                  size="small"
                  href="https://blog.owlbear.rodeo/are-owlbear-rodeos-dice-still-fair/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Explain
                </Button>
                {rolledDie && (
                  <ExportButton
                    rolledDie={rolledDie}
                    rolledValues={rolledValues}
                  />
                )}
              </Stack>
            )}
            {finished && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleRestart()}
              >
                Restart
              </Button>
            )}
          </Stack>
        </Paper>
      </Slide>
    </>
  );
}

function ExportButton({
  rolledValues,
  rolledDie,
}: {
  rolledValues: number[];
  rolledDie: Die;
}) {
  const [url, setUrl] = useState("#");

  useEffect(() => {
    const content = rolledValues.join("\n");
    const file = new Blob([content], { type: "text/plain" });
    const href = URL.createObjectURL(file);
    setUrl(href);
    return () => {
      URL.revokeObjectURL(href);
    };
  }, [rolledValues]);

  return (
    <Button
      variant="outlined"
      fullWidth
      endIcon={<DownloadRounded />}
      size="small"
      href={url}
      download={`${rolledDie.style}-${rolledDie.type}-rolls-${rolledValues.length}.txt`}
    >
      Export
    </Button>
  );
}

function Alerts({
  singleDiceSelected,
  numberRolls,
  active,
  rolled,
}: {
  singleDiceSelected: boolean;
  numberRolls: number;
  active: boolean;
  rolled: boolean;
}) {
  const bonus = useDiceControlsStore((state) => state.diceBonus);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);

  if (active || rolled) {
    return null;
  }

  return (
    <>
      {bonus > 0 && (
        <Alert severity="warning">Bonus not supported by fairness tester</Alert>
      )}
      {advantage && (
        <Alert severity="warning">
          Advantage not supported by fairness tester
        </Alert>
      )}
      {!singleDiceSelected && (
        <Alert severity="warning">Select one dice to begin testing</Alert>
      )}
      {numberRolls < 500 && (
        <Alert severity="warning">
          Low number of rolls selected. This will give inaccurate results
        </Alert>
      )}
    </>
  );
}
