import { useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { DiceSet } from "./types/DiceSet";
import { diceSets } from "./sets/diceSets";
import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { DiceDialog } from "./controls/DiceDialog";
import { useDiceRollStore } from "./dice/store";
import { DiceSetsDialog } from "./controls/DiceSetsDialog";

export function App() {
  const [dialogSet, setDialogSet] = useState<DiceSet>(diceSets[0]);

  const startRoll = useDiceRollStore((state) => state.startRoll);

  return (
    <Container disableGutters maxWidth="md">
      <Stack direction="row" justifyContent="center">
        <Sidebar>
          <DiceSetsDialog onChange={setDialogSet} />
          <DiceDialog
            diceSet={dialogSet}
            onRoll={(roll) => {
              startRoll(roll);
            }}
          />
        </Sidebar>
        <InteractiveTray />
      </Stack>
    </Container>
  );
}
