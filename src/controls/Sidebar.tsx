import Stack from "@mui/material/Stack";

import { PartyTrays } from "../plugin/PartyTrays";
import { PluginGate } from "../plugin/PluginGate";
import { DiceRollSync } from "../plugin/DiceRollSync";
import { ResizeObserver as PluginResizeObserver } from "../plugin/ResizeObserver";

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      maxHeight="100vh"
      width="60px"
      sx={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <Stack p={1} gap={2} alignItems="center">
        {children}
        <PluginGate>
          <DiceRollSync />
          <PartyTrays />
          <PluginResizeObserver />
        </PluginGate>
      </Stack>
    </Stack>
  );
}
