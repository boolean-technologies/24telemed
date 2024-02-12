import type { Meta, StoryObj } from '@storybook/react';
import { Input, InputProps } from './Input';
import { ThemeProvider } from 'styled-components';
import { theme } from '../config';
type Story = StoryObj<typeof Input>;

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Input',
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};



export const Default: Story = {
  args: {
    value: 'Hello',
    onChange: (value: string) => console.log(value),
  },
};

export const WithIcon: Story = {
  args: {
    value: 'Hello',
    onChange: (value: string) => console.log(value),
    icon: 'https://via.placeholder.com/20',
  },
};

export const Empty: Story = {
  args: {
    value: '',
    onChange: (value: string) => console.log(value),
  },
};

export default meta;