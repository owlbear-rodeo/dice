import { Die } from "./Die";

/**
 * A dice set represents a group of dice that can be selected in the UI.
 * The default dice sets represent the 7 dice for each dice style but
 * more dice sets can be added that mix and match different styles and types.
 */
export interface DiceSet {
  id: string;
  name: string;
  dice: Die[];
  previewImage: string;
}
