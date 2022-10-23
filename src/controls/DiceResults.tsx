import { useMemo } from "react";

import Typography from "@mui/material/Typography";

import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import { DiceRoll } from "../types/DiceRoll";

export function DiceResults({
  diceRoll,
  rollValues,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
}) {
  const finalValue = useMemo(() => {
    return getCombinedDiceValue(diceRoll, rollValues);
  }, [diceRoll, rollValues]);

  return <Typography variant="h3">{finalValue}</Typography>;
}
