import { useMemo } from "react";

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

import CloseIcon from "@mui/icons-material/ExpandMoreRounded";
import ResetIcon from "@mui/icons-material/RestartAltRounded";
import HiddenOnIcon from "@mui/icons-material/VisibilityOffRounded";
import HiddenOffIcon from "@mui/icons-material/VisibilityRounded";

import { useState } from "react";

import { DiceType } from "../types/DiceType";
import { DieCount } from "./DieCount";
import { DieBonus } from "./DieBonus";
import { DieAdvantage } from "./DieAdvantage";
import { Die } from "../types/Die";
import { SlideTransition } from "./SlideTransition";
import { DicePreview } from "../previews/DicePreview";
import {
  Advantage,
  DiceCounts,
  getDiceToRoll,
  useDiceControlsStore,
} from "./store";
import { useDiceRollStore } from "../dice/store";

export function DiceDialog() {
  const startRoll = useDiceRollStore((state) => state.startRoll);

  const open = useDiceControlsStore((state) => state.diceDialogOpen);
  const closeDialog = useDiceControlsStore((state) => state.closeDiceDialog);

  const diceSet = useDiceControlsStore((state) => state.diceSet);
  const defaultDiceCounts = useDiceControlsStore(
    (state) => state.defaultDiceCounts
  );

  const counts = useDiceControlsStore((state) => state.diceCounts);
  const bonus = useDiceControlsStore((state) => state.diceBonus);
  const setBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);
  const hidden = useDiceControlsStore((state) => state.diceHidden);

  const diceById = useDiceControlsStore((state) => state.diceById);

  const handleDiceCountChange = useDiceControlsStore(
    (state) => state.changeDieCount
  );
  const handleDiceCountIncrease = useDiceControlsStore(
    (state) => state.incrementDieCount
  );
  const handleDiceCountDecrease = useDiceControlsStore(
    (state) => state.decrementDieCount
  );
  const resetDiceCounts = useDiceControlsStore(
    (state) => state.resetDiceCounts
  );

  function handleRoll(counts: DiceCounts, bonus: number, advantage: Advantage) {
    const dice = getDiceToRoll(counts, advantage, diceById);
    startRoll({ dice, bonus, hidden });
    handleReset();
    closeDialog();
  }

  function handleReset() {
    resetDiceCounts();
    setBonus(0);
    setAdvantage(null);
  }

  const handleHide = useDiceControlsStore((state) => state.toggleDiceHidden);

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
        counts: DiceCounts;
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
    <Dialog
      open={open}
      onClose={closeDialog}
      fullScreen
      sx={{
        ".MuiDialog-container": {
          pl: "60px",
        },
      }}
      TransitionComponent={SlideTransition}
      container={() => document.getElementById("dice-dialog-container")}
    >
      <TopActions
        onClose={closeDialog}
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
        onBonusIncrease={() => setBonus(bonus + 1)}
        onBonusDecrease={() => setBonus(bonus - 1)}
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
        counts: DiceCounts;
        bonus: number;
        advantage: Advantage;
      }[]
    | undefined;
  diceById: Record<string, Die>;
  onRoll: (counts: DiceCounts, bonus: number, advantage: Advantage) => void;
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
                        size="small"
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
  counts: DiceCounts;
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
              onChange={onCountChange}
              onIncrease={onCountIncrease}
              onDecrease={onCountDecrease}
              count={count}
              die={die}
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
