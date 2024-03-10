import styled, { css } from "styled-components";

import type {
  FontWeightVariants,
  PaletteVariants,
  SpacingVariants,
  TypographyVariants,
} from "../styles";
import { getTextColor, makeVariant } from "../styles";
import {
  ResponsiveProps,
  ResponsivePropsBase,
  createResponsiveProps,
} from "../styles/createResponsiveProps";
import { FC } from "react";

interface TypographyResponsivePropsBase extends ResponsivePropsBase {
  align?: "center" | "inherit" | "left" | "right" | "justify";
}

const responsiveProps = createResponsiveProps<TypographyResponsivePropsBase>({
  Align: "text-align",
});

export interface TypographyProps
  extends TypographyResponsivePropsBase,
    ResponsiveProps<TypographyResponsivePropsBase> {
  variant?: TypographyVariants;
  color?: PaletteVariants;
  colorOn?: PaletteVariants;
  noWrap?: boolean;
  link?: boolean;
  fullWidth?: boolean;
  as?: string;
  decoration?: "line-through" | "underline" | "none";
  weight?: FontWeightVariants;
  marginBottom?: SpacingVariants;
  disabled?: boolean;
}

type TypographyMapping = {
  [key in TypographyVariants]: string;
};

const mapping: TypographyMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  bodyXl: "p",
  bodyLg: "p",
  bodyMd: "p",
  bodySm: "p",
  bodyXs: "p",
};

export const Typography: FC<TypographyProps> = styled.p.attrs<TypographyProps>(
  ({ variant = "bodyMd", as }) => ({
    variant,
    as: as ?? mapping[variant],
  }),
)<TypographyProps>`
  color: ${getTextColor};
  text-align: ${({ align }) => align ?? "left"};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  margin-top: 0;
  margin-bottom: ${({ marginBottom = "none", theme }) =>
    theme.spacing[marginBottom]};

  ${makeVariant}

  ${({ noWrap }) =>
    noWrap
      ? css`
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `
      : css`
          overflow-wrap: break-word;
        `}

  ${({ link, theme }) =>
    link &&
    css`
      text-decoration: ${theme.typography.link.textDecoration};
      font-weight: ${theme.typography.link.fontWeight};
    `}

  > a {
    text-decoration: ${({ theme }) => theme.typography.link.textDecoration};
    font-weight: ${({ theme }) => theme.typography.link.fontWeight};
  }

  ${({ decoration }) =>
    decoration &&
    css`
      text-decoration: ${decoration};
    `};
  ${({ weight, theme }) =>
    weight &&
    css`
      font-weight: ${theme.typography.fontWeight[weight]};
    `};
  ${({ theme, disabled }) =>
    disabled &&
    css`
      opacity: ${theme.opacity.disabled};
    `};
  ${responsiveProps}
`;
