import type { Meta, StoryObj } from "@storybook/react";

import { Typography } from "./Typography";

const meta: Meta<typeof Typography> = {
  title: "Design System/Typography",
  component: Typography,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Typography>;

export const H1: Story = {
  args: {
    variant: "h1",
    children: "H1 - Make a good move!",
  },
};

export const H2: Story = {
  args: {
    variant: "h2",
    children: "H2 - Make a good move!",
  },
};

export const H3: Story = {
  args: {
    variant: "h3",
    children: "H3 - Make a good move!",
  },
};

export const H4: Story = {
  args: {
    variant: "h4",
    children: "H4 - Make a good move!",
  },
};

export const H5: Story = {
  args: {
    variant: "h5",
    children: "H5 - Make a good move!",
  },
};

export const H6: Story = {
  args: {
    variant: "h6",
    children: "H6 - Make a good move!",
  },
};

export const BodyLg: Story = {
  args: {
    variant: "bodyLg",
    children: "BodyLg - Make a good move!",
  },
};

export const BodyMd: Story = {
  args: {
    variant: "bodyMd",
    children: "BodyMd - Make a good move!",
  },
};

export const BodySm: Story = {
  args: {
    variant: "bodySm",
    children: "BodySm - Make a good move!",
  },
};

export const BodyXs: Story = {
  args: {
    variant: "bodyXs",
    children: "BodyXs - Make a good move!",
  },
};

export const NoWrap: Story = {
  args: {
    variant: "h1",
    noWrap: true,
    children:
      "Make a good move! The most impactful benefit bike service recommended by 96% of employees.",
  },
};

export const Link: Story = {
  args: {
    variant: "bodyMd",
    link: true,
    children: "Make a good move!",
  },
};
