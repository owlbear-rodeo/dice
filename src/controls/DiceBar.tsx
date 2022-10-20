import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import { DiceSet } from "../types/DiceSet";

const PreviewImage = styled("img")({
  width: "38px",
  height: "38px",
});

type DiceBarProps = {
  diceSets: DiceSet[];
  onOpen: (set: DiceSet) => void;
};

export function DiceBar({ diceSets, onOpen }: DiceBarProps) {
  return (
    <Container maxWidth="xs" disableGutters>
      <Stack direction="row" sx={{ overflowX: "scroll" }}>
        {diceSets.map((diceSet) => (
          <IconButton
            key={diceSet.id}
            aria-label={diceSet.name}
            onClick={() => {
              onOpen(diceSet);
            }}
            sx={{ padding: 0, margin: "auto" }}
          >
            <PreviewImage src={diceSet.previewImage} />
          </IconButton>
        ))}
      </Stack>
    </Container>
  );
}
