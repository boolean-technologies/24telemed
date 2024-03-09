import type { Meta } from "@storybook/react";
import { capitalize, get } from "lodash-es";
import styled, { css, useTheme } from "styled-components";

import type { PaletteVariants, Theme } from "./theme.types";

interface ColorProps {
  variant: PaletteVariants;
}

function Color({ variant }: ColorProps) {
  const theme = useTheme() as Theme;
  return (
    <ColorRoot variant={variant}>
      <div>
        {capitalize(variant.split(/(\d)./g).join(" ").split(".").join(" "))}
      </div>
      <div>{get(theme.palette, variant)}</div>
    </ColorRoot>
  );
}

const ColorRoot = styled.div<ColorProps>`
  width: 300px;
  height: 137px;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${({ theme }) => css`
    border: 2px solid ${theme.palette.neutral.main};
  `}

  ${({ theme, variant }) => css`
    color: ${get(theme.onPalette, variant)};
    background-color: ${get(theme.palette, variant)};
  `}
`;

function Layout() {
  return (
    <div>
      <Row>
        <Color variant="primary1.main" />
        <Color variant="primary1.light" />
        <Color variant="primary1.lighter" />
      </Row>
      <Row>
        <Color variant="primary2.main" />
        <Color variant="primary2.light" />
        <Color variant="primary2.lighter" />
      </Row>
      <Row>
        <Color variant="secondary1.main" />
        <Color variant="secondary1.light" />
        <Color variant="secondary1.lighter" />
      </Row>
      <Row>
        <Color variant="secondary2.main" />
        <Color variant="secondary2.light" />
        <Color variant="secondary2.lighter" />
      </Row>
      <Row>
        <Color variant="neutral.main" />
        <Color variant="neutral.light" />
        <Color variant="neutral.lighter" />
      </Row>
      <Row>
        <Color variant="common.black" />
        <Color variant="common.white" />
      </Row>
      <Row>
        <Color variant="error" />
        <Color variant="success" />
        <Color variant="notification" />
      </Row>
    </div>
  );
}

const Row = styled.div`
  display: flex;
  gap: 24px;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

const Story: Meta<typeof Layout> = {
  component: Layout,
  title: "Components/Colors",
};
export default Story;

export const Colors = {
  args: {},
};
