import type { Meta, StoryObj } from '@storybook/react';

import {NavLink } from './NavLink';
import { MemoryRouter } from "react-router";
import { StarIcon } from '../Icon';

type Story = StoryObj<typeof NavLink>;

const meta: Meta<typeof NavLink> = {
  component: NavLink,
  title: 'Components/BottomNav/NavLink',
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
};


export default meta;

export const ActiveNavLink: Story = {
  args: {
    to: "/",
    label: "Home",
    color: "black",
    topIcon: <StarIcon />,
    active: true,
  },
};

export const InactiveNavLink: Story = {
  args: {
    to: "/",
    label: "Home",
    color: "black",
    topIcon: <StarIcon />,
    active: false,
  },
};

