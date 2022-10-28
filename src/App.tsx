import { useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { DiceBar } from "./controls/DiceBar";
import { DiceSet } from "./types/DiceSet";
import { diceSets } from "./sets/diceSets";
import { PartyTrays } from "./plugin/PartyTrays";
import { PluginGate } from "./plugin/PluginGate";
import { DiceRollSync } from "./plugin/DiceRollSync";
import { InteractiveTray } from "./tray/InteractiveTray";
import { ResizeObserver } from "./plugin/ResizeObserver";

export function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSet, setDialogSet] = useState<DiceSet>(diceSets[0]);

  return (
    <Container disableGutters maxWidth="md">
      <Stack direction="row" justifyContent="center">
        <Stack maxHeight="100vh" width="60px" sx={{ overflowY: "auto" }}>
          <Stack p={1} gap={2}>
            <DiceBar
              diceSets={diceSets}
              onOpen={(set) => {
                setDialogSet(set);
                setDialogOpen(true);
              }}
            />
            <PluginGate>
              <DiceRollSync />
              <PartyTrays />
              <ResizeObserver />
            </PluginGate>
          </Stack>
        </Stack>
        <InteractiveTray
          dialogOpen={dialogOpen}
          onDialogClose={() => setDialogOpen(false)}
          dialogSet={dialogSet}
        />
      </Stack>
    </Container>
  );
}
