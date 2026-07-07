/** Shared design tokens — matched to the 24Telemed web app brand. */

export type Palette = {
  primary: string;
  primaryDark: string;
  accent: string;
  cta: string;
  ctaText: string;
  background: string;
  surface: string;
  /** A slightly raised surface (headers of cards, chips) — same as surface in light. */
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  /** Teal-tinted background used for highlights (tips, active rows, icon chips). */
  tint: string;
  /** Text/icon colour that reads well on `tint`. */
  tintText: string;
  success: string;
  danger: string;
  link: string;
  white: string;
};

export const lightColors: Palette = {
  // Teal used across the personnel/doctor headers.
  primary: '#2BAEA4',
  primaryDark: '#1F8E86',
  accent: '#2BAEA4',
  // Primary call-to-action buttons are black in the web app.
  cta: '#101010',
  ctaText: '#ffffff',
  background: '#f4f5f6',
  surface: '#ffffff',
  surfaceAlt: '#ffffff',
  text: '#101820',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  tint: '#e8f6f4',
  tintText: '#1F8E86',
  success: '#34c759',
  danger: '#e5484d',
  link: '#2f6bff',
  white: '#ffffff',
};

export const darkColors: Palette = {
  primary: '#2BAEA4',
  primaryDark: '#248f87',
  accent: '#2BAEA4',
  // A teal CTA reads better than pure black on a dark background.
  cta: '#2BAEA4',
  ctaText: '#04211f',
  background: '#0f1417',
  surface: '#171f24',
  surfaceAlt: '#1e272d',
  text: '#e8edf0',
  textMuted: '#95a3ad',
  border: '#2a353c',
  tint: '#14312e',
  tintText: '#5fd6cb',
  success: '#3ad06a',
  danger: '#ff6166',
  link: '#6b9bff',
  // Stays white — used for text/icons on the teal header & buttons, which are
  // dark enough in both themes.
  white: '#ffffff',
};

/**
 * Legacy default export used by screens that haven't opted into runtime
 * theming yet. Points at the light palette so those screens keep working.
 */
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
};
