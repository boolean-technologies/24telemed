import { ReactElement, memo } from "react";

import styled, { css } from "styled-components";

import type {
  BreakpointSizes,
  IconFontSizeVariants,
  PaletteVariants,
  Theme,
} from "../styles";
import { getTextColor } from "../styles";

export interface SvgIconProps {
  color?: PaletteVariants;
  colorOn?: PaletteVariants;
  size?: IconFontSizeVariants;
  hideDown?: BreakpointSizes;
}

export const SvgIcon = styled.i<SvgIconProps>`
  fill: ${getTextColor};
  font-size: ${({ size = "md", theme }) => theme.icon.fontSizes[size]};
  width: 1em;
  height: 1em;
  display: flex;

  > svg {
    width: 1em;
    height: 1em;
    fill: ${getTextColor};
  }

  ${({ hideDown, theme }: { hideDown?: BreakpointSizes; theme: Theme }) =>
    hideDown &&
    theme.breakpoints[hideDown].down(css`
      display: none;
    `)}
`;

export function createSvgIcon(path: ReactElement, displayName: string, color?: PaletteVariants) {
  function Component(props: SvgIconProps) {
    return (
      <SvgIcon data-testid={`${displayName}Icon`}  {...props} color={color}>
        {path}
      </SvgIcon>
    );
  }

  if (process.env.NODE_ENV !== "production") {
    Component.displayName = `${displayName}Icon`;
  }

  return memo(Component);
}
