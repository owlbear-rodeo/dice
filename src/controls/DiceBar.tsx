import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import { DiceSet } from "../types/DiceSet";

const PreviewImage = styled("img")({
  width: "32px",
  height: "32px",
});

type DiceBarProps = {
  diceSets: DiceSet[];
  onOpen: (set: DiceSet) => void;
};

export function DiceBar({ diceSets, onOpen }: DiceBarProps) {
  return (
    <Stack sx={{ overflowY: "auto" }} gap={1}>
      {diceSets.map((diceSet) => (
        <IconButton
          key={diceSet.id}
          aria-label={diceSet.name}
          onClick={() => {
            onOpen(diceSet);
          }}
          sx={{ padding: "4px" }}
        >
          <PreviewImage src={diceSet.previewImage} />
        </IconButton>
      ))}
    </Stack>
  );
}
