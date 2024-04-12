import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";

export function App() {
  return (
    <Stack direction="row" justifyContent="center">
      <Sidebar />
      <InteractiveTray />
    </Stack>
  );
}
