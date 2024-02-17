import styled, { css } from "styled-components";

import { SpacingVariants } from "../styles";
import {
  ResponsiveProps,
  ResponsivePropsBase,
  createResponsiveProps,
} from "../styles/createResponsiveProps";
import { FC } from "react";

export type Justify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-around"
  | "space-between"
  | "space-evenly";

type Align = "flex-start" | "flex-end" | "center";

interface FlexResponsivePropsBase extends ResponsivePropsBase {
  direction?: "column" | "row";
  gap?: SpacingVariants;
  justify?: Justify;
  align?: Align;
  padding?: SpacingVariants;
}

export interface FlexProps
  extends FlexResponsivePropsBase,
    ResponsiveProps<FlexResponsivePropsBase> {
  marginBottom?: SpacingVariants;
  className?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

const responsiveProps = createResponsiveProps<FlexResponsivePropsBase>(
  {
    Direction: "flex-direction",
    Gap: "gap",
    Justify: "justify-content",
    Align: "align-items",
    Padding: "padding",
  },
  {
    Gap: (theme, value: SpacingVariants) => theme.spacing[value],
    Padding: (theme, value: SpacingVariants) => theme.spacing[value],
  },
);

export const Flex: FC<FlexProps> = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction = "row" }) => direction};
  justify-content: ${({ justify = "flex-start" }) => justify};
  align-items: ${({ align, direction }) =>
    align ?? (direction === "column" ? "stretch" : "center")};
  gap: ${({ theme, gap = "sm" }) => theme.spacing[gap]};
  margin-bottom: ${({ theme, marginBottom = "none" }) =>
    theme.spacing[marginBottom]};
  ${({ theme, padding }) =>
    padding &&
    css`
      padding: ${theme.spacing[padding]};
    `};
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100%;
    `};

  ${responsiveProps}
`;