import { styled } from "@mui/material/styles";

export const GradientOverlay = styled("div", {
  shouldForwardProp: (prop) => prop !== "top" && prop !== "height",
})<{ top?: boolean; height?: number }>(({ top, height }) => ({
  background: `linear-gradient(to ${
    top ? "bottom" : "top"
  }, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0) ${
    (height || 100) * 0.75
  }px), linear-gradient(to ${
    top ? "bottom" : "top"
  }, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) ${height || 100}px)`,
  position: "absolute",
  zIndex: 0,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
}));
