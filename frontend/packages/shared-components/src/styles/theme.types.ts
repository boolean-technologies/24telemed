import type { ThemedCssFunction } from "styled-components";
import { RecursiveKeyOf } from "../utils.types";



export type Sizes = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
export type OptionalSizes = Sizes | "none";

export type FromSize<T extends OptionalSizes, V> = {
  [K in T]: V;
};

export interface Tones {
  main: string;
  light: string;
  lighter: string;
}

export interface MainPalettes {
  primary1: Tones;
  primary2: Tones;
  secondary1: Tones;
  secondary2: Tones;
  secondary3: Tones;
  neutral: Tones;
}

export interface Palettes extends MainPalettes {
  error: string;
  success: string;
  notification: string;
  common: {
    black: string;
    white: string;
    transparent: string;
    warning: string;
  };
  background: {
    main: string;
    secondary: string;
    white: string;
  };
}

export type BreakpointSizes = "xs" | "sm" | "md" | "lg";

export type Breakpoints = FromSize<BreakpointSizes, number>;

export interface Breakpoint {
  value: number;
  up: MediaWrapperFunction;
  down: MediaWrapperFunction;
}

export type ThemeBreakpoints = {
  [key in keyof Breakpoints]: Breakpoint;
};

export interface TypographyVariant {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: number;
  letterSpacing?: string;
}

export interface HeadingVariant extends TypographyVariant {
  fontSizeSm: string;
  textTransform: string;
}

export interface ButtonVariant extends TypographyVariant {
  height: string;
  textTransform: string;
}

export interface TypographyLink {
  fontWeight: number;
  textDecoration: string;
  fontSize: string;
  fontFamily: string;
}

export interface FontWeight {
  regular: number;
  bold: number;
}

export type FontWeightVariants = keyof FontWeight;

export interface TypographyTheme {
  htmlFontSize: number;
  fontFamily: string;
  fontWeight: FontWeight;
  defaultColor: string;
  h1: HeadingVariant;
  h2: HeadingVariant;
  h3: HeadingVariant;
  h4: HeadingVariant;
  h5: HeadingVariant;
  h6: HeadingVariant;
  bodyLg: TypographyVariant;
  bodyMd: TypographyVariant;
  bodySm: TypographyVariant;
  bodyXs: TypographyVariant;
  button: ButtonVariant;
  navigationButton: ButtonVariant;
  link: TypographyLink;
}

export type TypographyVariants =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "bodyLg"
  | "bodyMd"
  | "bodySm"
  | "bodyXs";

export type Radius = {
  none: string;
  progressBar: string;
  languageSelect: string;
  notification: string;
  dropdown: string;
  tooltip: string;
  textarea: string;
  searchResultCard: string;
  card: string;
  button: string;
  toast: string;
};

export type RadiusVariants = keyof Radius;

export type Border = {
  primary: {
    main: string;
    light: string;
  };
  secondary: {
    main: string;
    light: string;
  };
  bold: {
    main: string;
    light: string;
  };
};

export type Spacing = FromSize<
  "none" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl",
  string
>;

export type SpacingVariants = keyof Spacing;

export type Height = {
  navBar: string;
};

export type Shadows = FromSize<"none" | "md" | "lg" | "xl", string> & {
  input: string;
  inset: string;
};

export type ShadowVariants = keyof Shadows;

export type IconFontSize = FromSize<"sm" | "md" | "lg", string>;

export type IconFontSizeVariants = keyof IconFontSize;

export interface Icon {
  fontSizes: IconFontSize;
}

export interface Opacity {
  disabled: 0.3;
  muted: 0.6;
  dimmed: 0.8;
}

export interface Easing {
  easeInOut: string;
  easeOut: string;
}

export type EasingVariants = keyof Easing;

export interface Durations {
  shortest: number;
  shorter: number;
  short: number;
  standard: number;
  complex: number;
  enteringScreen: number;
  leavingScreen: number;
}

export type DurationVariants = keyof Durations;

export interface Transitions {
  easing: Easing;
  duration: Durations;
}

export interface ZIndex {
  toaster: number;
  appBar: number;
  modal: number;
  selectPopper: number;
  tooltip: number;
}

export interface Theme {
  palette: Palettes;
  onPalette: Palettes;
  breakpoints: ThemeBreakpoints;
  typography: TypographyTheme;
  radius: Radius;
  border: Border;
  spacing: Spacing;
  height: Height;
  sizes: Array<Sizes>;
  shadows: Shadows;
  icon: Icon;
  opacity: Opacity;
  transitions: Transitions;
  zIndex: ZIndex;
  button: {
    primary: {
      backgroundColor: string;
      color: string;
      hoverBackgroundColor: string;
      disabledBackgroundColor: string;
      disabledColor: string;
      hoverColor: string;
      focusBackgroundColor: string;
      pressedBackgroundColor: string;
      
    };
    secondary: {
      backgroundColor: string;
      color: string;
      hoverBackgroundColor: string;
      disabledBackgroundColor: string;
      disabledColor: string;
      hoverColor: string;
      focusBackgroundColor: string;
      pressedBackgroundColor: string;
    };
    tertiary: {
      backgroundColor: string;
      color: string;
      hoverBackgroundColor: string;
      disabledBackgroundColor: string;
      disabledColor: string;
      hoverColor: string;
      focusBackgroundColor: string;
      pressedBackgroundColor: string;
    };
  };

}

export type PaletteVariants = RecursiveKeyOf<Palettes>;

export type MainPaletteVariants = keyof MainPalettes;

type ThemedCssFunctionReturn = ReturnType<ThemedCssFunction<Theme>>;

export type MediaWrapperFunction = (
  cssResult: ThemedCssFunctionReturn,
) => ThemedCssFunctionReturn;


export type NewButtonVariant = "primary" | "secondary" | "tertiary";