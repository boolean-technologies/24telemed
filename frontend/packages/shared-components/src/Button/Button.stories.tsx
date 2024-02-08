import { ButtonProps, Button } from './Button';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  component:Button,
};

export default meta;

export const Primary: Story = {
  args: {
    color: 'white',
    onClick: () => console.log('clicked'),
    label: 'Click me',
    hoverColor: 'lightblue',
    activeColor: 'darkblue',
    focusColor: 'lightblue',
    backgroundColor: 'blue',
  },
};
export const Secondary: Story = {
  args: {
    color: 'white',
    onClick: () => console.log('clicked'),
    label: 'Click me',
    hoverColor: 'lightgreen',
    activeColor: 'darkgreen',
    focusColor: 'lightgreen',
    backgroundColor: 'green',
  },
};
export const Tertiary: Story = {
  args: {
    color: 'white',
    onClick: () => console.log('clicked'),
    label: 'Click me',
    hoverColor: 'lightgrey',
    activeColor: 'darkgrey',
    focusColor: 'lightgrey',
    backgroundColor: 'grey',
  },
};
