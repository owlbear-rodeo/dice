import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/ChevronLeftRounded";
import ResetIcon from "@mui/icons-material/RestartAltRounded";
import HiddenOnIcon from "@mui/icons-material/VisibilityOffRounded";
import HiddenOffIcon from "@mui/icons-material/VisibilityRounded";
import ArrowRightIcon from "@mui/icons-material/ArrowCircleRightRounded";

import { useState } from "react";

import { DiceRoll } from "../types/DiceRoll";
import { DiceType } from "../types/DiceType";
import { DieCount } from "./DieCount";
import { DieBonus } from "./DieBonus";
import { DieAdvantage } from "./DieAdvantage";
import { Die } from "../types/Die";
import { DiceSet } from "../types/DiceSet";
import { Dice } from "../types/Dice";
import { SlideTransition } from "./SlideTransition";
import { generateDiceId } from "../helpers/generateDiceId";
import { DicePreview } from "../previews/DicePreview";

const PreviewImage = styled("img")({
  width: "32px",
  height: "32px",
});

type Advantage = "ADVANTAGE" | "DISADVANTAGE" | null;

type DiceDialogProps = {
  diceSet: DiceSet;
  onRoll: (roll: DiceRoll) => void;
};

export function DiceDialog({ diceSet, onRoll }: DiceDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultDiceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const die of diceSet.dice) {
      counts[die.id] = 0;
    }
    return counts;
  }, [diceSet]);
  const [counts, setCounts] =
    useState<Record<string, number>>(defaultDiceCounts);

  const [bonus, setBonus] = useState(0);
  const [advantage, setAdvantage] = useState<Advantage>(null);
  const [hidden, setHidden] = useState(false);

  const diceById = useMemo(() => {
    const byId: Record<string, Die> = {};
    for (const die of diceSet.dice) {
      byId[die.id] = die;
    }
    return byId;
  }, [diceSet.dice]);

  // Keep track of previous state to carry over count
  const prevCountsRef = useRef(counts);
  const prevDiceRef = useRef(diceSet.dice);
  useEffect(() => {
    prevCountsRef.current = counts;
  }, [counts]);
  useEffect(() => {
    prevDiceRef.current = diceSet.dice;
  }, [diceSet.dice]);

  // Carry over count state when changing dice sets
  useLayoutEffect(() => {
    const counts: Record<string, number> = {};
    const prevCounts = prevCountsRef.current;
    const prevDice = prevDiceRef.current;
    for (let i = 0; i < diceSet.dice.length; i++) {
      const die = diceSet.dice[i];
      const prevDie = prevDice[i];
      // Carry over count if the index and die type match
      if (prevDie && prevDie.type === die.type) {
        counts[die.id] = prevCounts[prevDie.id] || 0;
      } else {
        counts[die.id] = 0;
      }
    }
    setCounts(counts);
  }, [diceSet]);

  function handleDiceCountChange(id: string, count: number) {
    setCounts((prev) => ({ ...prev, [id]: count }));
  }

  function handleDiceCountIncrease(id: string) {
    setCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  }

  function handleDiceCountDecrease(id: string) {
    setCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  }

  function handleRoll(
    counts: Record<string, number>,
    bonus: number,
    advantage: Advantage
  ) {
    const dice: (Die | Dice)[] = [];
    const countEntries = Object.entries(counts);
    for (const [id, count] of countEntries) {
      const die = diceById[id];
      if (!die) {
        continue;
      }
      const { style, type } = die;
      for (let i = 0; i < count; i++) {
        if (advantage === null) {
          if (type === "D100") {
            // Push a d100 and d10 when rolling a d100
            dice.push({
              dice: [
                { id: generateDiceId(), style, type: "D100" },
                { id: generateDiceId(), style, type: "D10" },
              ],
            });
          } else {
            dice.push({ id: generateDiceId(), style, type });
          }
        } else {
          // Rolling with advantage or disadvantage
          const combination = advantage === "ADVANTAGE" ? "HIGHEST" : "LOWEST";
          if (type === "D100") {
            // Push 2 d100s and d10s
            dice.push({
              dice: [
                {
                  dice: [
                    { id: generateDiceId(), style, type: "D100" },
                    { id: generateDiceId(), style, type: "D10" },
                  ],
                },
                {
                  dice: [
                    { id: generateDiceId(), style, type: "D100" },
                    { id: generateDiceId(), style, type: "D10" },
                  ],
                },
              ],
              combination,
            });
          } else {
            dice.push({
              dice: [
                { id: generateDiceId(), style, type },
                { id: generateDiceId(), style, type },
              ],
              combination,
            });
          }
        }
      }
    }
    onRoll({ dice, bonus, hidden });
    handleReset();
    setDialogOpen(false);
  }

  function handleReset() {
    setCounts(defaultDiceCounts);
    setBonus(0);
    setAdvantage(null);
  }

  function handleHide() {
    setHidden((prev) => !prev);
  }

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

  // A mapping from dice set ID to its most recent roll states
  const [recentRollsPerSet, setRecentRollsPerSet] = useState<
    Record<
      string,
      {
        counts: Record<string, number>;
        bonus: number;
        advantage: Advantage;
      }[]
    >
  >({});
  const recentRolls = recentRollsPerSet[diceSet.id];
  function handleRecentsPush() {
    // Push to recent rolls stack
    setRecentRollsPerSet((prev) => ({
      ...prev,
      [diceSet.id]: [
        // Keep last 6 rolls
        ...(prev[diceSet.id] || []).slice(-5),
        {
          counts,
          advantage,
          bonus,
        },
      ],
    }));
  }
  function handleRecentsDelete(index: number) {
    setRecentRollsPerSet((prev) => ({
      ...prev,
      [diceSet.id]: [...(prev[diceSet.id] || []).filter((_, i) => i !== index)],
    }));
  }

  return (
    <>
      <Tooltip
        disableFocusListener
        disableTouchListener
        PopperProps={{
          sx: {
            ".MuiTooltip-tooltip": {
              background: "none",
              p: 0,
            },
            maxHeight: "calc(100vh - 60px)",
            overflowY: "auto",
            "::-webkit-scrollbar": { display: "none" },
            pb: 2,
            borderRadius: "26px",
          },
        }}
        onClose={() => setCounts(defaultDiceCounts)}
        title={
          <Paper
            sx={{
              borderRadius: "24px",
            }}
            elevation={8}
          >
            <Stack>
              {Object.entries(counts).map(([id, count]) => {
                const die = diceById[id];
                if (!die) {
                  return null;
                }
                return (
                  <IconButton
                    key={id}
                    onClick={() => handleDiceCountIncrease(id)}
                  >
                    <Badge badgeContent={count} color="primary">
                      <DicePreview diceStyle={die.style} diceType={die.type} />
                    </Badge>
                  </IconButton>
                );
              })}
              <IconButton
                onClick={() => {
                  handleRoll(counts, bonus, advantage);
                  handleRecentsPush();
                }}
                sx={{ width: "54px", height: "54px" }}
              >
                <ArrowRightIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Stack>
          </Paper>
        }
      >
        <Stack width="100%" alignItems="center">
          <IconButton
            sx={{ padding: "4px", width: "40px" }}
            onClick={() => setDialogOpen(true)}
          >
            <PreviewImage src={diceSet.previewImage} />
          </IconButton>
        </Stack>
      </Tooltip>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullScreen
        TransitionComponent={SlideTransition}
      >
        <TopActions
          onClose={() => setDialogOpen(false)}
          isDefault={isDefault}
          onReset={handleReset}
          hidden={hidden}
          onHide={handleHide}
        />
        <RecentRolls
          recentRolls={recentRolls}
          onRoll={handleRoll}
          diceById={diceById}
          onDelete={handleRecentsDelete}
        />
        <Controls
          counts={counts}
          diceById={diceById}
          onCountChange={handleDiceCountChange}
          onCountIncrease={handleDiceCountIncrease}
          onCountDecrease={handleDiceCountDecrease}
          bonus={bonus}
          onBonusChange={setBonus}
          onBonusIncrease={() => setBonus((prev) => prev + 1)}
          onBonusDecrease={() => setBonus((prev) => prev - 1)}
          advantage={advantage}
          onAdvantageChange={setAdvantage}
        />
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              handleRoll(counts, bonus, advantage);
              handleRecentsPush();
            }}
            fullWidth
            disabled={Object.values(counts).every((count) => count === 0)}
          >
            Roll
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function TopActions({
  onClose,
  isDefault,
  onReset,
  hidden,
  onHide,
}: {
  onClose: () => void;
  isDefault: boolean;
  onReset: () => void;
  hidden: boolean;
  onHide: () => void;
}) {
  return (
    <DialogActions sx={{ justifyContent: "space-between" }}>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Stack direction="row">
        {!isDefault && (
          <Tooltip title="Reset">
            <IconButton onClick={onReset}>
              <ResetIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={hidden ? "Show Roll" : "Hide Roll"}>
          <IconButton onClick={onHide}>
            {hidden ? <HiddenOnIcon /> : <HiddenOffIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </DialogActions>
  );
}

function RecentRolls({
  recentRolls,
  diceById,
  onRoll,
  onDelete,
}: {
  recentRolls:
    | {
        counts: Record<string, number>;
        bonus: number;
        advantage: Advantage;
      }[]
    | undefined;
  diceById: Record<string, Die>;
  onRoll: (
    counts: Record<string, number>,
    bonus: number,
    advantage: Advantage
  ) => void;
  onDelete: (index: number) => void;
}) {
  if (!recentRolls || recentRolls.length === 0) {
    return null;
  }

  return (
    <>
      <Stack
        justifyContent="center"
        flexWrap="wrap"
        gap={1}
        direction="row"
        p={1}
      >
        {recentRolls.map((state, i) => (
          <Chip
            key={i}
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
                {Object.entries(state.counts).map(([id, count]) => {
                  const die = diceById[id];
                  if (!die || count === 0) {
                    return null;
                  }
                  return (
                    <Stack
                      key={id}
                      direction="row"
                      alignItems="center"
                      gap={0.25}
                    >
                      {count}{" "}
                      <DicePreview
                        diceStyle={die.style}
                        diceType={die.type}
                        small
                      />
                    </Stack>
                  );
                })}
                {state.bonus !== 0 && (
                  <span>
                    {state.bonus > 0 && "+"}
                    {state.bonus}
                  </span>
                )}
                {state.advantage !== null && (
                  <span>{state.advantage === "ADVANTAGE" ? "Adv" : "Dis"}</span>
                )}
              </Stack>
            }
            variant="filled"
            onClick={() => onRoll(state.counts, state.bonus, state.advantage)}
            onDelete={() => onDelete(i)}
          />
        ))}
      </Stack>
      <Divider variant="middle" />
    </>
  );
}

function Controls({
  counts,
  diceById,
  onCountChange,
  onCountIncrease,
  onCountDecrease,
  onBonusChange,
  onBonusIncrease,
  onBonusDecrease,
  bonus,
  advantage,
  onAdvantageChange,
}: {
  counts: Record<string, number>;
  diceById: Record<string, Die>;
  onCountChange: (id: string, count: number) => void;
  onCountIncrease: (id: string) => void;
  onCountDecrease: (id: string) => void;
  onBonusChange: (bonus: number) => void;
  onBonusIncrease: () => void;
  onBonusDecrease: () => void;
  bonus: number;
  advantage: Advantage;
  onAdvantageChange: (advantage: Advantage) => void;
}) {
  return (
    <DialogContent sx={{ p: 0 }}>
      <List>
        {Object.entries(counts).map(([id, count]) => {
          const die = diceById[id];
          if (!die) {
            return null;
          }
          return (
            <DieCount
              key={id}
              onChange={(newCount) => onCountChange(id, newCount)}
              onIncrease={() => onCountIncrease(id)}
              onDecrease={() => onCountDecrease(id)}
              count={count}
              diceStyle={die.style}
              diceType={die.type}
            />
          );
        })}
      </List>
      <Divider variant="middle" />
      <List>
        <DieBonus
          bonus={bonus}
          onChange={onBonusChange}
          onIncrease={onBonusIncrease}
          onDecrease={onBonusDecrease}
        />
      </List>
      <Divider variant="middle" />
      <DieAdvantage advantage={advantage} onChange={onAdvantageChange} />
    </DialogContent>
  );
}
