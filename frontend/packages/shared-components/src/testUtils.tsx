import React, { ReactElement } from "react";

import "@testing-library/jest-dom/vitest";
import { RenderOptions, render } from "@testing-library/react";
import "jest-styled-components";
import { ThemeProvider } from "styled-components";
import { vi } from "vitest";

import { defaultTheme } from "./styles/defaultTheme";

export * from "./testHelpers";

const AllTheProviders = ({ children }: { children: ReactElement }) => {
  return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
  // @ts-ignore
) => render(ui, { wrapper: AllTheProviders, ...options });

const matchMedia = (mediaRule: string) =>
  vi.fn((media: string) => ({
    matches: media === mediaRule,
    media,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render, matchMedia };
