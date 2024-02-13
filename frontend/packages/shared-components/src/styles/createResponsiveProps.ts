import { css } from "styled-components";

import { breakpoints } from "./defaultTheme";
import { Breakpoints, Theme } from "./theme.types";

export type ResponsivePropsBase = Record<string, unknown>;

export type ResponsiveProps<TResponsivePropsBase extends ResponsivePropsBase> =
  {
    [K in keyof TResponsivePropsBase as `${keyof Breakpoints}${Capitalize<
      string & K
    >}`]?: TResponsivePropsBase[K];
  };

export type PropsCssMap<TResponsivePropsBase extends ResponsivePropsBase> =
  Required<{
    [K in keyof TResponsivePropsBase as Capitalize<string & K>]: string;
  }>;

export type ResponsivePropsGetters<
  TResponsivePropsBase extends ResponsivePropsBase,
> = Partial<{
  [K in keyof PropsCssMap<TResponsivePropsBase>]: (
    theme: Theme,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
  ) => string;
}>;

export const createResponsiveProps = <
  TResponsivePropsBase extends ResponsivePropsBase,
>(
  propsCssMap: PropsCssMap<TResponsivePropsBase>,
  responsivePropsGetters?: ResponsivePropsGetters<TResponsivePropsBase>,
) =>
  function responsiveProps(
    props: ResponsiveProps<TResponsivePropsBase> & { theme: Theme },
  ) {
    const breakpointKeys = Object.keys(breakpoints) as Array<keyof Breakpoints>;
    const cssMapEntries = Object.entries(propsCssMap);

    const styles = [];
    for (let i = 0; i < breakpointKeys.length; i++) {
      const breakpoint = breakpointKeys[i];
      let cssProperties = "";

      for (let j = 0; j < cssMapEntries.length; j++) {
        const [propBase, cssProp] = cssMapEntries[j] as [
          keyof PropsCssMap<TResponsivePropsBase>,
          string,
        ];
        if (typeof propBase !== "string") continue;

        const prop =
          `${breakpoint}${propBase}` as keyof ResponsiveProps<TResponsivePropsBase>;
        const value = props[prop];

        if (value !== undefined) {
          const transformedValue = responsivePropsGetters?.[propBase]?.(
            props.theme,
            value,
          );
          cssProperties += `${cssProp}: ${transformedValue ?? value};`;
        }
      }

      if (cssProperties) {
        styles.push(
          props.theme.breakpoints[breakpoint].down(css`
            ${cssProperties}
          `),
        );
      }
    }

    return styles;
  };
