import { useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { DiceSet } from "./types/DiceSet";
import { diceSets } from "./sets/diceSets";
import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";

export function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSet, setDialogSet] = useState<DiceSet>(diceSets[0]);

  return (
    <Container disableGutters maxWidth="md">
      <Stack direction="row" justifyContent="center">
        <Sidebar
          onDiceSetOpen={(set) => {
            setDialogSet(set);
            setDialogOpen(true);
          }}
        />
        <InteractiveTray
          dialogOpen={dialogOpen}
          onDialogClose={() => setDialogOpen(false)}
          dialogSet={dialogSet}
        />
      </Stack>
    </Container>
  );
}
