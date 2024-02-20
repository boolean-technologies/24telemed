import type { Meta, StoryFn } from '@storybook/react';
import { Button, BaseButtonProps } from './Button';
import { StarIcon } from '../Icon';

export default {
  title: 'Button',
  component: Button,
} as Meta;

const Template: StoryFn<BaseButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  text: 'Primary button',
  variant: 'primary',
};

export const PrimaryDisabled = Template.bind({});

PrimaryDisabled.args = {
  text: 'Primary button',
  variant: 'primary',
  disabled: true,
};

export const PrimaryWithRightIcon = Template.bind({});

PrimaryWithRightIcon.args = {
  text: 'Primary button',
  variant: 'primary',
  rightIcon: <StarIcon />,
};

export const PrimaryWithLeftIcon = Template.bind({});

PrimaryWithLeftIcon.args = {
  text: 'Primary button',
  variant: 'primary',
  leftIcon: <StarIcon />,
};

export const IconOnly = Template.bind({});

IconOnly.args = {
  text: '',
  variant: 'primary',
  rightIcon: <StarIcon />,
};
export const Secondary = Template.bind({});

Secondary.args = {
  text: 'Secondary button',
  variant: 'secondary',
};

export const secondaryDisabled = Template.bind({});

secondaryDisabled.args = {
  text: 'Secondary button',
  variant: 'secondary',
  disabled: true,
};

export const Tertiary = Template.bind({});

Tertiary.args = {
  text: 'Tertiary button',
  variant: 'tertiary',
};

export const TertiaryDisabled = Template.bind({});

TertiaryDisabled.args = {
  text: 'Tertiary button',
  variant: 'tertiary',
  disabled: true,
};
