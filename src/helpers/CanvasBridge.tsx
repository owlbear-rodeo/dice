import React from "react";
import { PluginThemeProvider } from "../plugin/PluginThemeProvider";

/** Bridge contexts between react and react-three-fibre */
export function CanvasBridge({ children }: { children: React.ReactNode }) {
  return <PluginThemeProvider>{children}</PluginThemeProvider>;
}
