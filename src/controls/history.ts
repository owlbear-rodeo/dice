import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { Advantage, DiceCounts } from "./store";
import { Die } from "../types/Die";

export interface RecentRoll {
  counts: DiceCounts;
  bonus: number;
  advantage: Advantage;
  diceById: Record<string, Die>;
}

interface DiceHistoryState {
  recentRolls: RecentRoll[];
  pushRecentRoll: (roll: RecentRoll) => void;
  removeRecentRoll: (index: number) => void;
}

export const useDiceHistoryStore = create<DiceHistoryState>()(
  immer((set) => ({
    recentRolls: [],
    pinnedRolls: [],
    pushRecentRoll(roll) {
      set((state) => {
        if (state.recentRolls.length > 5) {
          state.recentRolls.splice(0, 1);
        }
        state.recentRolls.push(roll);
      });
    },
    removeRecentRoll(index) {
      set((state) => {
        state.recentRolls.splice(index, 1);
      });
    },
  }))
);
