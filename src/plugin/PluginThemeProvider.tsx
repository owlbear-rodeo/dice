import { Theme as MuiTheme, createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import OBR, { Theme } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

/**
 * Create a MUI theme based off of the current OBR theme
 * If no theme is provided create the base dark theme
 */
function getTheme(theme?: Theme) {
  return createTheme({
    palette: theme
      ? {
          mode: theme.mode === "LIGHT" ? "light" : "dark",
          text: theme.text,
          primary: theme.primary,
          secondary: theme.secondary,
          background: theme?.background,
        }
      : {
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
            backgroundColor: OBR.isAvailable ? "transparent" : undefined,
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
              theme?.mode === "LIGHT"
                ? "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))"
                : "linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))",
          },
        },
      },
    },
  });
}

/**
 * Provide a MUI theme with the same palette as the parent OBR window
 */
export function PluginThemeProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [theme, setTheme] = useState<MuiTheme>(() => getTheme());
  const [ready, setReady] = useState(() => OBR.isReady);

  useEffect(() => {
    if (OBR.isAvailable) {
      OBR.onReady(() => setReady(true));
    }
  }, []);

  useEffect(() => {
    if (ready) {
      const updateTheme = (theme: Theme) => {
        setTheme(getTheme(theme));
      };
      OBR.theme.getTheme().then(updateTheme);
      return OBR.theme.onChange(updateTheme);
    }
  }, [ready]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
