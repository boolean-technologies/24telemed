import { get } from "lodash-es";
import { css } from "styled-components";
import invariant from "tiny-invariant";

import {
  Breakpoints,
  DurationVariants,
  EasingVariants,
  MediaWrapperFunction,
  PaletteVariants,
  Theme,
  ThemeBreakpoints,
  TypographyVariants,
} from "./theme.types";

export function createUp(value: number): MediaWrapperFunction {
  return (cssResult) => css`
    @media (min-width: ${value}px) {
      ${cssResult}
    }
  `;
}

export function createDown(value: number): MediaWrapperFunction {
  return (cssResult) => css`
    @media (max-width: ${value - 0.05}px) {
      ${cssResult}
    }
  `;
}

export function createThemeBreakpoints(
  breakpoints: Breakpoints,
): ThemeBreakpoints {
  const entries = Object.entries(breakpoints) as Array<
    [keyof Breakpoints, number]
  >;
  const result = entries.reduce((acc, [key, value]) => {
    acc[key] = {
      value,
      up: createUp(value),
      down: createDown(value),
    };
    return acc;
  }, {} as ThemeBreakpoints);
  return result;
}

export function getTextColor({
  color,
  colorOn,
  theme,
}: {
  color?: PaletteVariants;
  colorOn?: PaletteVariants;
  theme: Theme;
}) {
  invariant(
    !(color && colorOn),
    "Typography: Can't use both color and colorOn props at the same time",
  );
  if (colorOn) return get(theme.onPalette, colorOn);
  return color ? get(theme.palette, color) : theme.typography.defaultColor;
}

export function makeTransition(
  property: string,
  duration: DurationVariants,
  easing: EasingVariants,
) {
  return ({ theme }: { theme: Theme }) => css`
    transition: ${property} ${theme.transitions.duration[duration]}ms
      ${theme.transitions.easing[easing]};
  `;
}

export function isSafari() {
  // used to disabled animation on safari
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function addAlpha(color: string, opacity: number) {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return (color + _opacity.toString(16).padStart(2, "0")).toUpperCase();
}


export function makeVariant({
  theme,
  variant = "bodyMd",
}: {
  theme: Theme;
  variant?: TypographyVariants;
}) {
  const typography = theme.typography[variant];
  return css`
    font-family: ${typography.fontFamily};
    font-size: ${typography.fontSize};
    font-weight: ${typography.fontWeight};
    line-height: ${typography.lineHeight};

    ${typography.letterSpacing &&
    css`
      letter-spacing: ${typography.letterSpacing};
    `}
    ${"textTransform" in typography &&
    css`
      text-transform: ${typography.textTransform};
    `}

    ${"fontSizeSm" in typography &&
    theme.breakpoints.sm.down(css`
      font-size: ${typography.fontSizeSm};
    `)}
  `;
}