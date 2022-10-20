import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuid } from "uuid";
import { WritableDraft } from "immer/dist/types/types-external";

import { DiceRoll } from "../types/DiceRoll";
import { isDie } from "../types/Die";
import { isDice } from "../types/Dice";
import { getDieFromDice } from "../helpers/getDieFromDice";

interface DiceRollState {
  roll: DiceRoll | null;
  /**
   * A mapping from the die ID to its roll result.
   * A value of `null` means the die hasn't finished rolling yet.
   */
  rollValues: Record<string, number | null>;
  startRoll: (roll: DiceRoll) => void;
  clearRoll: (ids?: string) => void;
  /** Reroll select ids of dice or reroll all dice by passing `undefined` */
  reroll: (ids?: string[]) => void;
  updateValue: (id: string, number: number) => void;
}

export const useDiceRollStore = create<DiceRollState>()(
  immer((set) => ({
    roll: null,
    rollValues: {},
    startRoll: (roll) =>
      set((state) => {
        state.roll = roll;
        state.rollValues = {};
        // Set all values to null
        const dice = getDieFromDice(roll);
        for (const die of dice) {
          state.rollValues[die.id] = null;
        }
      }),
    clearRoll: () =>
      set((state) => {
        state.roll = null;
        state.rollValues = {};
      }),
    reroll: (ids) => {
      set((state) => {
        if (state.roll) {
          rerollDraft(state.roll, ids, state.rollValues);
        }
      });
    },
    updateValue: (id, number) =>
      set((state) => {
        state.rollValues[id] = number;
      }),
  }))
);

/** Recursively update the ids of a draft to reroll dice */
function rerollDraft(
  diceRoll: WritableDraft<DiceRoll>,
  ids: string[] | undefined,
  rollValues: WritableDraft<Record<string, number | null>>
) {
  for (let dieOrDice of diceRoll.dice) {
    if (isDie(dieOrDice)) {
      if (!ids || ids.includes(dieOrDice.id)) {
        delete rollValues[dieOrDice.id];
        const id = uuid();
        dieOrDice.id = id;
        rollValues[id] = null;
      }
    } else if (isDice(dieOrDice)) {
      rerollDraft(dieOrDice, ids, rollValues);
    }
  }
}
