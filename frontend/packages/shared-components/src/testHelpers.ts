// Contrary to testUtils, this file is meant to host helpers that can be used by other packages or apps
import { BreakpointSizes, breakpoints } from "./styles";

type MediaQueries = Record<BreakpointSizes, Record<"up" | "down", string>>;

export const mediaQueries = Object.entries(breakpoints).reduce<
  Partial<MediaQueries>
>((acc, [key, value]) => {
  acc[key as BreakpointSizes] = {
    up: `(min-width:${value}px)`,
    down: `(max-width:${value - 0.05}px)`,
  };
  return acc;
}, {}) as MediaQueries;

