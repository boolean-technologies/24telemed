import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo';

type Story = StoryObj<typeof Logo>;

const Meta: Meta<typeof Logo> = {
    component: Logo,
    title: "Components/Logo",
  };
  export default Meta;

  export const LogoComponent = {
    args: {},
  };
  


