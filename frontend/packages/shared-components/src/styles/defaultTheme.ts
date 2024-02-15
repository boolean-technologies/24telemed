import type { Breakpoints, PaletteVariants, Theme } from "./theme.types";
import { createThemeBreakpoints } from "./utils";

export const breakpoints: Breakpoints = {
  xs: 600,
  sm: 900,
  md: 1200,
  lg: 1400,
};

const fontFamily = '"Uniform Rounded","Helvetica","Arial",sans-serif';
const fontFamilyHeading =
  '"Uniform Rounded Ex Cond","Helvetica","Arial",sans-serif';

export const colorVariants: Array<PaletteVariants> = [
  "primary1.main",
  "primary1.light",
  "primary1.lighter",
  "primary2.main",
  "primary2.light",
  "primary2.lighter",
  "secondary1.main",
  "secondary1.light",
  "secondary1.lighter",
  "secondary2.main",
  "secondary2.light",
  "secondary2.lighter",
  "secondary3.main",
  "secondary3.light",
  "secondary3.lighter",
  "neutral.main",
  "neutral.light",
  "neutral.lighter",
  "error",
  "success",
  "notification",
  "common.black",
  "common.white",
  "common.transparent",
  "common.helper",
  
];

export const defaultTheme: Theme = {
  palette: {
    primary1: {
      main: "#2F4D52",
      light: "#829497",
      lighter: "#D5DBDC",
    },
    primary2: {
      main: "#FFF875",
      light: "#FFFBAC",
      lighter: "#FFFEE3",
    },
    secondary1: {
      main: "#5CD6C2",
      light: "#9DE6DA",
      lighter: "#DEF7F3",
    },
    secondary2: {
      main: "#ED7F75",
      light: "#F19991",
      lighter: "#FBE5E3",
    },
    secondary3: {
      main: "#FFB06C",
      light: "#FFD0A7",
      lighter: "#FFEFE2",
    },
    neutral: {
      main: "#EAEDEE",
      light: "#F2F4F5",
      lighter: "#FBFBFC",
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
      transparent: "transparent",
      helper: "#9747FF",
    },
    background: {
      main: "#F7F8F8",
      secondary: "#EFF5F6",
      white: "#FFFFFF",
    },
    error: "#FF6363",
    success: "#6FCF97",
    notification: "#9DE6DA",
  },
  onPalette: {
    primary1: {
      main: "#FFFFFF",
      light: "#FFFFFF",
      lighter: "#2F4D52",
    },
    primary2: {
      main: "#2F4D52",
      light: "#2F4D52",
      lighter: "#2F4D52",
    },
    secondary1: {
      main: "#2F4D52",
      light: "#2F4D52",
      lighter: "#2F4D52",
    },
    secondary2: {
      main: "#2F4D52",
      light: "#2F4D52",
      lighter: "#2F4D52",
    },
    secondary3: {
      main: "#2F4D52",
      light: "#2F4D52",
      lighter: "#2F4D52",
    },
    neutral: {
      main: "#2F4D52",
      light: "#2F4D52",
      lighter: "#2F4D52",
    },
    common: {
      black: "#FFFFFF",
      white: "#2F4D52",
      transparent: "#2F4D52",
      helper: "#9747FF",
    },
    background: {
      main: "#2F4D52",
      secondary: "#2F4D52",
      white: "#2F4D52",
    },
    error: "#FFFFFF",
    success: "#FFFFFF",
    notification: "#2F4D52",
  },
  breakpoints: createThemeBreakpoints(breakpoints),
  typography: {
    htmlFontSize: 16,
    fontFamily: fontFamily,
    fontWeight: {
      regular: 400,
      bold: 700,
    },
    defaultColor: "#2F4D52",
    h1: {
      fontFamily: fontFamilyHeading,
      fontWeight: 700,
      fontSize: "3.5rem",
      fontSizeSm: "3rem",
      lineHeight: 0.96,
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: fontFamilyHeading,
      fontWeight: 700,
      fontSize: "3rem",
      fontSizeSm: "2.25rem",
      lineHeight: 0.96,
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
    },
    h3: {
      fontFamily: fontFamilyHeading,
      fontWeight: 700,
      fontSize: "2.25rem",
      fontSizeSm: "2rem",
      lineHeight: 0.96,
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
    },
    h4: {
      fontFamily: fontFamilyHeading,
      fontWeight: 700,
      fontSize: "2rem",
      fontSizeSm: "1.75rem",
      lineHeight: 0.96,
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
    },
    h5: {
      fontFamily: fontFamilyHeading,
      fontWeight: 700,
      fontSize: "1.75rem",
      fontSizeSm: "1.5rem",
      lineHeight: 0.96,
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
    },
    h6: {
      fontFamily: fontFamilyHeading,
      fontWeight: 700,
      fontSize: "1.5rem",
      fontSizeSm: "1.25rem",
      lineHeight: 0.96,
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
    },
    bodyLg: {
      fontFamily: fontFamily,
      fontWeight: 400,
      fontSize: "1.125rem",
      lineHeight: 1.5,
    },
    bodyMd: {
      fontFamily: fontFamily,
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    bodySm: {
      fontFamily: fontFamily,
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    bodyXs: {
      fontFamily: fontFamily,
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    button: {
      fontFamily: fontFamily,
      fontWeight: 700,
      fontSize: "1rem",
      lineHeight: 1.5,
      height: "3.5rem",
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
    },
    navigationButton: {
      fontFamily: fontFamily,
      fontWeight: 700,
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "-0.02em",
      height: "2.5rem",
      textTransform: "uppercase",
    },
    link: {
      fontWeight: 700,
      textDecoration: "underline",
      fontSize: "1.125rem",
      fontFamily: fontFamily,
    },
  },
  radius: {
    none: "0px",
    progressBar: "4px",
    languageSelect: "8px",
    notification: "8px",
    dropdown: "10px",
    tooltip: "10px",
    textarea: "10px",
    searchResultCard: "10px",
    card: "20px",
    button: "99px",
    toast: "999px",
  },
  border: {
    primary: {
      main: "2px solid #2F4D52",
      light: "1px solid rgba(47, 77, 82, 0.20)",
    },
    secondary: {
      main: "2px dashed #2F4D52",
      light: "2px dashed rgba(47, 77, 82, 0.20)",
    },
    bold: {
      main: "6px solid #2F4D52",
      light: "5px solid #2F4D52",
    },
  },
  spacing: {
    none: "0px",
    xxs: "4px",
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "48px",
  },
  height: {
    navBar: "80px",
  },
  sizes: ["xs", "sm", "md", "lg", "xl"],
  shadows: {
    // TODO: discuss also about the shadows, it inherently convey a meaning of elevation depending on how far the shadow is projected
    // I don't think with the current use we have it's working well
    none: "none",
    input: "0px 0px 10px 0px rgba(47,77,82,0.25)",
    md: "8px 13px 30px 0px #2F4D521A",
    lg: "3px 4px 15px 0px #2F4D5240",
    xl: "8px 13px 30px 0px #2F4D5240",
    inset: "3px 4px 10px 0px #2F4D5240 inset",
  },
  icon: {
    fontSizes: {
      sm: "1rem",
      md: "1.5rem",
      lg: "3rem",
    },
  },
  opacity: {
    disabled: 0.3,
    muted: 0.6,
    dimmed: 0.8,
  },
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    },
    duration: {
      shortest: 160,
      shorter: 175,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  zIndex: {
    appBar: 1200,
    modal: 1500,
    toaster: 1600,
    selectPopper: 1700,
    tooltip: 1800,
  },
};
