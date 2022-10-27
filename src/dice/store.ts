import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuid } from "uuid";
import { WritableDraft } from "immer/dist/types/types-external";

import { DiceRoll } from "../types/DiceRoll";
import { isDie } from "../types/Die";
import { isDice } from "../types/Dice";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { DiceTransform } from "../types/DiceTransform";
import { getRandomDiceTransform } from "../helpers/getRandomDiceTransform";

interface DiceRollState {
  roll: DiceRoll | null;
  /**
   * A mapping from the die ID to its roll result.
   * A value of `null` means the die hasn't finished rolling yet.
   */
  rollValues: Record<string, number | null>;
  rollTransforms: Record<string, DiceTransform>;
  startRoll: (roll: DiceRoll) => void;
  clearRoll: (ids?: string) => void;
  /** Reroll select ids of dice or reroll all dice by passing `undefined` */
  reroll: (ids?: string[]) => void;
  updateValue: (id: string, number: number) => void;
  updateTransforms: (
    transforms: { id: string; transform: DiceTransform }[]
  ) => void;
}

export const useDiceRollStore = create<DiceRollState>()(
  immer((set) => ({
    roll: null,
    rollValues: {},
    rollTransforms: {},
    startRoll: (roll) =>
      set((state) => {
        state.roll = roll;
        state.rollValues = {};
        // Set all values to null
        const dice = getDieFromDice(roll);
        for (const die of dice) {
          state.rollValues[die.id] = null;
          state.rollTransforms[die.id] = getRandomDiceTransform();
        }
      }),
    clearRoll: () =>
      set((state) => {
        state.roll = null;
        state.rollValues = {};
        state.rollTransforms = {};
      }),
    reroll: (ids) => {
      set((state) => {
        if (state.roll) {
          rerollDraft(state.roll, ids, state.rollValues, state.rollTransforms);
        }
      });
    },
    updateValue: (id, number) =>
      set((state) => {
        state.rollValues[id] = number;
      }),
    updateTransforms: (transforms) =>
      set((state) => {
        for (const { id, transform } of transforms) {
          state.rollTransforms[id] = transform;
        }
      }),
  }))
);

/** Recursively update the ids of a draft to reroll dice */
function rerollDraft(
  diceRoll: WritableDraft<DiceRoll>,
  ids: string[] | undefined,
  rollValues: WritableDraft<Record<string, number | null>>,
  rollTransforms: WritableDraft<Record<string, DiceTransform>>
) {
  for (let dieOrDice of diceRoll.dice) {
    if (isDie(dieOrDice)) {
      if (!ids || ids.includes(dieOrDice.id)) {
        delete rollValues[dieOrDice.id];
        delete rollTransforms[dieOrDice.id];
        const id = uuid();
        dieOrDice.id = id;
        rollValues[id] = null;
        rollTransforms[id] = getRandomDiceTransform();
      }
    } else if (isDice(dieOrDice)) {
      rerollDraft(dieOrDice, ids, rollValues, rollTransforms);
    }
  }
}
