import React from "react";

import { withThemeFromJSXProvider } from "@storybook/addon-styling";
import { Preview } from "@storybook/react";
import { DecoratorFunction } from "@storybook/types";
import { ThemeProvider } from "styled-components";

import { CssBaseline } from "../src/CssBaseline";
import { Fonts } from "../src/Fonts";
import { defaultTheme } from "../src/styles/defaultTheme";

export const decorators: Array<DecoratorFunction> = [
  withThemeFromJSXProvider({
    themes: {
      default: defaultTheme,
    },
    defaultTheme: "default",
    Provider: ThemeProvider,
    GlobalStyles: CssBaseline,
  }),
  (Story) => (
    <>
      <Fonts />
      <Story />
    </>
  ),
];

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Design System", ["Colors"]],
      },
    },
  },
};

export default preview;
