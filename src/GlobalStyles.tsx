import MuiGlobalStyles from "@mui/material/GlobalStyles";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

export function GlobalStyles() {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const styles = useMemo(() => {
    return {
      body: {
        overflow: "hidden",
      },
      div: {
        ".simplebar-scrollbar:before": {
          background: mode === "dark" ? "#fff" : "rgba(0, 0, 0, 0.87)",
        },
        ".simplebar-track.simplebar-horizontal": {
          bottom: "6px",
        },
        ":not(.simplebar-content-wrapper)::-webkit-scrollbar": {
          backgroundColor: "transparent",
          borderRadius: "100px",
        },
        ":not(.simplebar-content-wrapper)::-webkit-scrollbar:vertical": {
          width: "10px",
        },
        ":not(.simplebar-content-wrapper)::-webkit-scrollbar:horizontal": {
          height: "10px",
        },
        ":not(.simplebar-content-wrapper)::-webkit-scrollbar:hover": {
          backgroundColor:
            mode === "dark"
              ? "rgba(255, 255, 255, 0.09)"
              : "rgba(0, 0, 0, 0.09)",
        },
        ":not(.simplebar-content-wrapper)::-webkit-scrollbar-thumb": {
          backgroundColor:
            mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
          borderRadius: "16px",
          backgroundClip: "padding-box",
          border: "2px solid transparent",
        },
        ":not(.simplebar-content-wrapper)::-webkit-scrollbar-thumb:vertical": {
          minHeight: "10px",
        },
        ":not(.simplebar-content-wrapper)::-webkit-scrollbar-thumb:horizontal":
          {
            minWidth: "10px",
          },
        ":not(.simplebar-content-wrapper)::-webkit-scrollbar-thumb:active": {
          backgroundColor:
            mode === "dark"
              ? "rgba(255, 255, 255, 0.61)"
              : "rgba(0, 0, 0, 0.61)",
        },
      },
    };
  }, [mode]);

  return <MuiGlobalStyles styles={styles} />;
}
