import { get } from "lodash-es";

import { colorVariants, defaultTheme } from "../styles";
import type { PaletteVariants, TypographyVariants } from "../styles";
import { ByRoleOptions, mediaQueries, render, screen } from "../testUtils";
import { Typography, TypographyProps } from "./Typography";

describe("Typography", () => {
  it.each([
    ["h1", { level: 1 }],
    ["h2", { level: 2 }],
    ["h3", { level: 3 }],
    ["h4", { level: 4 }],
    ["h5", { level: 5 }],
    ["h6", { level: 6 }],
  ] as Array<[TypographyVariants, ByRoleOptions]>)(
    "should render heading %s properly",
    (variant, option) => {
      const content = "Make a good move!";
      render(<Typography variant={variant}>{content}</Typography>);
      const el = screen.getByRole("heading", option);
      expect(el).toHaveTextContent(content);
      expect(el).toMatchSnapshot();
      expect(el).toHaveStyle({
        "font-family": defaultTheme.typography[variant].fontFamily,
        "font-weight": defaultTheme.typography[variant].fontWeight,
        "font-size": defaultTheme.typography[variant].fontSize,
        "line-height": defaultTheme.typography[variant].lineHeight,
        "letter-spacing": defaultTheme.typography[variant].letterSpacing,
        color: defaultTheme.typography.defaultColor,
        "text-align": "left",
      });
    },
  );

  it.each([
    "bodyLg",
    "bodyMd",
    "bodySm",
    "bodyXs",
  ] as Array<TypographyVariants>)(
    "should render paragraph %s properly",
    (variant) => {
      const content = "Make a good move!";
      render(<Typography variant={variant}>{content}</Typography>);
      const el = screen.getByText(content);
      expect(el).toBeInTheDocument();
      expect(el).toMatchSnapshot();
      expect(el).toHaveStyle({
        "font-family": defaultTheme.typography[variant].fontFamily,
        "font-weight": defaultTheme.typography[variant].fontWeight,
        "font-size": defaultTheme.typography[variant].fontSize,
        "line-height": defaultTheme.typography[variant].lineHeight,
        "letter-spacing": defaultTheme.typography[variant].letterSpacing,
        color: defaultTheme.typography.defaultColor,
        "text-align": "left",
      });
    },
  );

  it("should render properly with default values", () => {
    const content = "Make a good move!";
    render(<Typography>{content}</Typography>);
    const el = screen.getByText(content);
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
    expect(el).toHaveStyle({
      "font-family": defaultTheme.typography.bodyMd.fontFamily,
      "font-weight": defaultTheme.typography.bodyMd.fontWeight,
      "font-size": defaultTheme.typography.bodyMd.fontSize,
      "line-height": defaultTheme.typography.bodyMd.lineHeight,
      color: defaultTheme.typography.defaultColor,
      "margin-top": "0",
      "margin-bottom": "0",
      "text-align": "left",
    });
  });

  it.each(["center", "left", "right", "justify"] as Array<
    TypographyProps["align"]
  >)("should render align %s properly", (align) => {
    const content = "Make a good move!";
    render(<Typography align={align}>{content}</Typography>);
    const el = screen.getByText(content);
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
    expect(el).toHaveStyle({
      "text-align": align,
    });
  });

  it("should render no wrap properly", () => {
    const content = "Make a good move!";
    render(<Typography noWrap>{content}</Typography>);
    const el = screen.getByText(content);
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
    expect(el).toHaveStyle({
      "white-space": "nowrap",
      overflow: "hidden",
      "text-overflow": "ellipsis",
    });
  });

  it("should render full width properly", () => {
    const content = "Make a good move!";
    render(<Typography fullWidth>{content}</Typography>);
    const el = screen.getByText(content);
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
    expect(el).toHaveStyle({
      width: "100%",
    });
  });

  it("should render link properly", () => {
    const content = "Make a good move!";
    render(<Typography link>{content}</Typography>);
    const el = screen.getByText(content);
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
    expect(el).toHaveStyle({
      "text-decoration": defaultTheme.typography.link.textDecoration,
      "font-weight": defaultTheme.typography.link.fontWeight,
    });
  });

  it.each(colorVariants)("should render color %s properly", (color) => {
    const content = "Make a good move!";
    render(<Typography color={color}>{content}</Typography>);
    const el = screen.getByText(content);
    expect(el).toBeInTheDocument();
    expect(el).toMatchSnapshot();
    expect(el).toHaveStyle({
      color: get(defaultTheme.palette, color),
    });
  });

  it.each([
    "primary1.main",
    "primary1.light",
    "primary1.lighter",
    "primary2.main",
    "primary2.light",
    "primary2.lighter",
    "secondary1.main",
    "secondary1.light",
    "secondary1.lighter",
    "secondary2.main",
    "secondary2.light",
    "secondary2.lighter",
    "secondary3.main",
    "secondary3.light",
    "secondary3.lighter",
    "neutral.main",
    "neutral.light",
    "neutral.lighter",
    "error",
    "success",
    "notification",
    "common.black",
    "common.white",
  ] as Array<PaletteVariants>)(
    "should render on color %s properly",
    (color) => {
      const content = "Make a good move!";
      render(<Typography colorOn={color}>{content}</Typography>);
      const el = screen.getByText(content);
      expect(el).toBeInTheDocument();
      expect(el).toMatchSnapshot();
      expect(el).toHaveStyle({
        color: get(defaultTheme.onPalette, color),
      });
    },
  );

  it("should apply responsive align prop correctly", () => {
    const { container } = render(
      <Typography smAlign="right">Make a good move!</Typography>,
    );
    expect(container.firstChild).toHaveStyleRule("text-align", "right", {
      media: mediaQueries.sm.down,
    });
  });
});
