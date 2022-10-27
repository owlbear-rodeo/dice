import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { v4 as uuid } from "uuid";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

import CloseIcon from "@mui/icons-material/ChevronLeftRounded";
import ResetIcon from "@mui/icons-material/RestartAltRounded";
import HiddenOnIcon from "@mui/icons-material/VisibilityOffRounded";
import HiddenOffIcon from "@mui/icons-material/VisibilityRounded";

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

type DiceDialogProps = {
  diceSet: DiceSet;
  open: boolean;
  onClose: () => void;
  onRoll: (roll: DiceRoll) => void;
};

export function DiceDialog({
  diceSet,
  open,
  onClose,
  onRoll,
}: DiceDialogProps) {
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
  const [advantage, setAdvantage] = useState<
    "ADVANTAGE" | "DISADVANTAGE" | null
  >(null);
  const [hidden, setHidden] = useState(false);

  const diceById = useMemo(() => {
    const byId: Record<string, Die> = {};
    for (const die of diceSet.dice) {
      byId[die.id] = die;
    }
    return byId;
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

  // Keep track of previous state to carry over count
  const prevCountsRef = useRef(counts);
  const prevDiceRef = useRef(diceSet.dice);
  useEffect(() => {
    prevCountsRef.current = counts;
  }, [counts]);
  useEffect(() => {
    prevDiceRef.current = diceSet.dice;
  }, [diceSet.dice]);

  function handleDiceCountChange(id: string, count: number) {
    setCounts((prev) => ({ ...prev, [id]: count }));
  }

  function handleDiceCountIncrease(id: string) {
    setCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  }

  function handleDiceCountDecrease(id: string) {
    setCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  }

  function handleRoll() {
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
                { id: uuid(), style, type: "D100" },
                { id: uuid(), style, type: "D10" },
              ],
            });
          } else {
            dice.push({ id: uuid(), style, type });
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
                    { id: uuid(), style, type: "D100" },
                    { id: uuid(), style, type: "D10" },
                  ],
                },
                {
                  dice: [
                    { id: uuid(), style, type: "D100" },
                    { id: uuid(), style, type: "D10" },
                  ],
                },
              ],
              combination,
            });
          } else {
            dice.push({
              dice: [
                { id: uuid(), style, type },
                { id: uuid(), style, type },
              ],
              combination,
            });
          }
        }
      }
    }
    onRoll({ dice, bonus, hidden });
  }

  function handleReset() {
    setCounts(defaultDiceCounts);
    setBonus(0);
    setAdvantage(null);
  }

  function handleHide() {
    setHidden((prev) => !prev);
  }

  const isDefault = useMemo(
    () =>
      Object.entries(defaultDiceCounts).every(
        ([type, count]) => counts[type as DiceType] === count
      ) &&
      advantage === null &&
      bonus === 0,
    [counts, defaultDiceCounts, advantage, bonus]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      sx={{ position: "absolute" }}
      TransitionComponent={SlideTransition}
      disablePortal
      hideBackdrop
    >
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Stack direction="row">
          {!isDefault && (
            <Tooltip title="Reset">
              <IconButton onClick={handleReset}>
                <ResetIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={hidden ? "Show Roll" : "Hide Roll"}>
            <IconButton onClick={handleHide}>
              {hidden ? <HiddenOnIcon /> : <HiddenOffIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogActions>
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
                onChange={(newCount) => handleDiceCountChange(id, newCount)}
                onIncrease={() => handleDiceCountIncrease(id)}
                onDecrease={() => handleDiceCountDecrease(id)}
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
            onChange={setBonus}
            onIncrease={() => setBonus((prev) => prev + 1)}
            onDecrease={() => setBonus((prev) => prev - 1)}
          />
        </List>
        <Divider variant="middle" />
        <DieAdvantage advantage={advantage} onChange={setAdvantage} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleRoll} fullWidth>
          Roll
        </Button>
      </DialogActions>
    </Dialog>
  );
}
