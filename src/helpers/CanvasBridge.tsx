import React from "react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

import { theme } from "../theme";

/** Bridge contexts between react and react-three-fibre */
export function CanvasBridge({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
