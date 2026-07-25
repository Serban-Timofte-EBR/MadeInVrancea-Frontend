import { createTheme, alpha } from "@mui/material/styles";

/**
 * Central design language for Made in Vrancea.
 *
 * Identity: a warm, editorial "regional premium" feel inspired by the
 * Vrancea wine country — bordeaux + gold on a soft cream canvas.
 */

const wine = "#8C2F39";
const gold = "#C79A3A";
const ink = "#2A2320";
const cream = "#FBF8F4";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: wine,
      dark: "#6E2029",
      light: "#A9505A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: gold,
      dark: "#A67E27",
      light: "#D9BA6B",
      contrastText: "#2A2320",
    },
    success: { main: "#3B7A57", light: "#E4F0EA", dark: "#2C5C41" },
    warning: { main: "#C7853A", light: "#F7ECDD", dark: "#9A6323" },
    error: { main: "#B23A3A", light: "#F6E3E3", dark: "#8A2A2A" },
    info: { main: "#3A6EA5", light: "#E1EAF4", dark: "#274d75" },
    background: {
      default: cream,
      paper: "#FFFFFF",
    },
    text: {
      primary: ink,
      secondary: "#6B615A",
    },
    divider: alpha(ink, 0.1),
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      "'Manrope', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: "'Fraunces', Georgia, serif",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: "'Fraunces', Georgia, serif",
      fontWeight: 600,
      letterSpacing: "-0.015em",
      lineHeight: 1.15,
    },
    h4: {
      fontFamily: "'Fraunces', Georgia, serif",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700, letterSpacing: "-0.005em" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: "0.01em" },
    button: { fontWeight: 600, letterSpacing: "0.01em" },
    overline: { fontWeight: 700, letterSpacing: "0.14em" },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.55 },
  },
  shadows: [
    "none",
    "0 1px 2px rgba(42,35,32,0.06)",
    "0 2px 6px rgba(42,35,32,0.07)",
    "0 6px 16px -8px rgba(42,35,32,0.16)",
    "0 10px 24px -12px rgba(42,35,32,0.18)",
    "0 14px 30px -14px rgba(42,35,32,0.20)",
    "0 18px 38px -16px rgba(42,35,32,0.22)",
    "0 22px 44px -18px rgba(42,35,32,0.24)",
    "0 26px 50px -20px rgba(42,35,32,0.26)",
    "0 30px 56px -22px rgba(42,35,32,0.28)",
    "0 34px 62px -24px rgba(42,35,32,0.30)",
    "0 38px 68px -26px rgba(42,35,32,0.30)",
    "0 42px 74px -28px rgba(42,35,32,0.30)",
    "0 46px 80px -30px rgba(42,35,32,0.30)",
    "0 50px 86px -32px rgba(42,35,32,0.30)",
    "0 54px 92px -34px rgba(42,35,32,0.30)",
    "0 58px 98px -36px rgba(42,35,32,0.30)",
    "0 62px 104px -38px rgba(42,35,32,0.30)",
    "0 66px 110px -40px rgba(42,35,32,0.30)",
    "0 70px 116px -42px rgba(42,35,32,0.30)",
    "0 74px 122px -44px rgba(42,35,32,0.30)",
    "0 78px 128px -46px rgba(42,35,32,0.30)",
    "0 82px 134px -48px rgba(42,35,32,0.30)",
    "0 86px 140px -50px rgba(42,35,32,0.30)",
    "0 90px 146px -52px rgba(42,35,32,0.30)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: cream },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: "lg" },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          paddingInline: 20,
          paddingBlock: 9,
          "&.MuiButton-containedPrimary": {
            boxShadow: "0 8px 20px -10px rgba(140,47,57,0.9)",
            "&:hover": { boxShadow: "0 12px 24px -10px rgba(140,47,57,0.95)" },
          },
        },
        sizeLarge: { paddingInline: 28, paddingBlock: 12, fontSize: "1rem" },
        sizeSmall: { paddingInline: 14, paddingBlock: 6 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: `1px solid ${alpha(ink, 0.08)}`,
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 9 },
        label: { paddingInline: 11 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: ink,
          borderRadius: 8,
          fontSize: "0.75rem",
          fontWeight: 600,
          paddingBlock: 6,
          paddingInline: 10,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});
