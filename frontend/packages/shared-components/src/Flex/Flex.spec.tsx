import { defaultTheme } from "../styles";
import { mediaQueries, render } from "../testUtils";
import { Flex } from "./Flex";

describe("Flex", () => {
  it("should render with default props", () => {
    const { container } = render(<Flex />);
    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toHaveStyleRule("display", "flex");
    expect(container.firstChild).toHaveStyleRule("flex-direction", "row");
    expect(container.firstChild).toHaveStyleRule(
      "justify-content",
      "flex-start",
    );
    expect(container.firstChild).toHaveStyleRule("align-items", "center");
  });

  it("should apply responsive props correctly", () => {
    const { container } = render(<Flex smDirection="column" />);
    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toHaveStyleRule("flex-direction", "column", {
      media: mediaQueries.sm.down,
    });
  });

  it("should apply responsive gap prop correctly", () => {
    const { container } = render(<Flex smGap="sm" />);
    expect(container.firstChild).toHaveStyleRule("gap", "16px", {
      media: mediaQueries.sm.down,
    });
  });

  it("should apply marginBottom prop", () => {
    const { container } = render(<Flex marginBottom="lg" />);
    expect(container.firstChild).toHaveStyleRule(
      "margin-bottom",
      defaultTheme.spacing.lg,
    );
  });

  it("should apply justify and align props", () => {
    const { container } = render(<Flex justify="center" align="flex-end" />);
    expect(container.firstChild).toHaveStyleRule("justify-content", "center");
    expect(container.firstChild).toHaveStyleRule("align-items", "flex-end");
  });

  it("should override align-items when direction is column", () => {
    const { container } = render(<Flex direction="column" />);
    expect(container.firstChild).toHaveStyleRule("align-items", "stretch");
  });
});
