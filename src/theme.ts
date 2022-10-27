import { createTheme, ThemeOptions } from "@mui/material/styles";
import { isEmbeded } from "./helpers/isEmbeded";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#bb99ff",
    },
    secondary: {
      main: "#ee99ff",
    },
    background: {
      paper: "#222639",
      default: "#1e2231",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: isEmbeded() ? "transparent" : undefined,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))",
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
