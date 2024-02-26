import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Typography } from '../Typography/Typography';
import { StarIcon } from '../Icon';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
};


export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    text: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    text: 'Tertiary Button',
    variant: 'tertiary',
  },
};

export const Disabled: Story = {
  args: {
    text: 'Disabled Button',
    disabled: true,
  },
};
export const RightIcon: Story = {
  args: {
    text: 'Right Icon Button',
    rightIcon: <StarIcon />,
  },
};

export const LeftIcon: Story = {
  args: {
    text: 'Left Icon Button',
    leftIcon: <StarIcon />,
  },
};
