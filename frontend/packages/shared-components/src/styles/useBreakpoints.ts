import { useEffect, useState } from "react";

import { defaultTheme } from "./defaultTheme";

type BreakpointsType = {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isMobile: boolean;
};

export function useBreakpoints(): BreakpointsType {
  const themeBreakpoints = defaultTheme.breakpoints;

  const breakpoints = {
    isXs: useMediaQuery(`(max-width: ${themeBreakpoints.xs.value}px)`),
    isSm: useMediaQuery(
      `(min-width: ${themeBreakpoints.xs.value + 1}px) and (max-width: ${
        themeBreakpoints.sm.value
      }px)`,
    ),
    isMd: useMediaQuery(
      `(min-width: ${themeBreakpoints.sm.value + 1}px) and (max-width: ${
        themeBreakpoints.md.value
      }px)`,
    ),
    isLg: useMediaQuery(
      `(min-width: ${themeBreakpoints.md.value + 1}px) and (max-width: ${
        themeBreakpoints.lg.value
      }px)`,
    ),
    isXl: useMediaQuery(`(min-width: ${themeBreakpoints.lg.value + 1}px)`),
  };

  return {
    ...breakpoints,
    isMobile: breakpoints.isXs || breakpoints.isSm,
  };
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
