import styled from "styled-components";

import { mediaQueries, render } from "../../testUtils";
import {
  ResponsiveProps,
  ResponsivePropsBase,
  createResponsiveProps,
} from "../createResponsiveProps";
import { SpacingVariants, Theme } from "../theme.types";

const mockPropsCssMap = {
  Padding: "padding",
  Align: "text-align",
  FullWidth: "width",
};

const mockGetters = {
  Padding: (theme: Theme, value: SpacingVariants) => theme.spacing[value],
  FullWidth: (theme: Theme, value: boolean) => (value ? "100%" : "auto"),
};

interface MockPropsBase extends ResponsivePropsBase {
  padding: SpacingVariants;
  align: string;
  fullWidth: boolean;
}

type MockProps = MockPropsBase & ResponsiveProps<MockPropsBase>;

const responsiveProps = createResponsiveProps<MockPropsBase>(
  mockPropsCssMap,
  mockGetters,
);

const DummyComponent = styled.div<MockProps>`
  ${responsiveProps}
`;

describe("createResponsiveProps", () => {
  it("should create responsive styles", () => {
    const { container } = render(
      <DummyComponent smPadding="sm" xsAlign="center" lgFullWidth />,
    );

    expect(container.firstChild).toHaveStyleRule("padding", "16px", {
      media: mediaQueries.sm.down,
    });
    expect(container.firstChild).toHaveStyleRule("text-align", "center", {
      media: mediaQueries.xs.down,
    });
    expect(container.firstChild).toHaveStyleRule("width", "100%", {
      media: mediaQueries.lg.down,
    });
  });

  it("should handle undefined values gracefully", () => {
    const { container } = render(
      <DummyComponent smPadding={undefined} mdAlign="right" />,
    );

    expect(container.firstChild).not.toHaveStyleRule("padding", undefined, {
      media: mediaQueries.sm.down,
    });
    expect(container.firstChild).toHaveStyleRule("text-align", "right", {
      media: mediaQueries.md.down,
    });
  });

  it("should handle the same props for different breakpoints gracefully", () => {
    const { container } = render(
      <DummyComponent
        xsFullWidth={false}
        smFullWidth
        mdFullWidth={false}
        lgFullWidth
      />,
    );

    expect(container.firstChild).toHaveStyleRule("width", "auto", {
      media: mediaQueries.xs.down,
    });
    expect(container.firstChild).toHaveStyleRule("width", "100%", {
      media: mediaQueries.sm.down,
    });
    expect(container.firstChild).toHaveStyleRule("width", "auto", {
      media: mediaQueries.md.down,
    });
    expect(container.firstChild).toHaveStyleRule("width", "100%", {
      media: mediaQueries.lg.down,
    });
    expect(container.firstChild).not.toHaveStyleRule("width", undefined);
  });
});
