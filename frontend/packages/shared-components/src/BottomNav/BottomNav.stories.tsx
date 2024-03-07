import type { Meta, StoryObj } from '@storybook/react';

import {NavLink } from './NavLink';
import { MemoryRouter } from "react-router";
import { StarIcon, BlackStarIcon } from '../Icon';
import { NavBar } from './NavBar';

type Story = StoryObj<typeof NavBar>;

const meta: Meta<typeof NavBar> = {
  component: NavBar,
  title: 'Components/BottomNav',
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
};

export default meta;

export const NavBarStory: Story = {
  args: {
    children: (
      <>
      <NavLink
        to="/"
        label="Home"
        color="black"
        topIcon={(props) => <StarIcon {...props} />}
        active={true}
      />

      <NavLink
        to="/"
        label="Recent"
        color="black"
        topIcon={(props) => <BlackStarIcon {...props} />}
        active={false}
      />

      <NavLink
        to="/"
        label="Favorites"
        color="black"
        topIcon={(props) => <StarIcon {...props} />}
        active={false}
      />
      </>
      
    ),
  },
};

