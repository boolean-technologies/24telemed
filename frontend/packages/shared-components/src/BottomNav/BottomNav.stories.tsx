import type { Meta, StoryObj } from '@storybook/react';

import {NavigationBar, NavigationBarProps} from './NavigationBar';
import { MemoryRouter } from "react-router";

type Story = StoryObj<typeof NavigationBar>;

const meta: Meta<typeof NavigationBar> = {
  component: NavigationBar,
  title: 'NavigationBar',
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
};

export default meta;

export const Primary: Story = {
  args: {
    to: '/',
    label: 'Home',
    color: 'white',
    backgroundColor: 'blue',
  },
};

