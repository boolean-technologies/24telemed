import type { Meta } from '@storybook/react';
import { PrimaryButton } from './PrimaryButton';


export default {
  title: 'Button/PrimaryButton',
  component: PrimaryButton,
} as Meta;

export const Primary = () => <PrimaryButton text="Primary Button" />;


export const DisabledPrimary = () => <PrimaryButton text="Disabled Primary Button" disabled  />;