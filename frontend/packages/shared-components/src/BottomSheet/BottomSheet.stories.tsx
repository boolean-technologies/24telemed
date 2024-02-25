import type { Meta, StoryObj } from '@storybook/react';
import { BottomSheetComponent } from './BottomSheetComponent';
import { Typography } from '../Typography/Typography';
import { TextInput } from '../Input/TextInput';
const meta: Meta<typeof BottomSheetComponent> = {
  title: 'Design System/BottomSheet',
  component: BottomSheetComponent,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof BottomSheetComponent>;

export const BottomSheet: Story = {
  args: {
    onClickCancel: () => {},
    children: <Typography variant="bodyLg">BottomSheet Content</Typography>,
  },
};

export const BottomSheetWithTitle: Story = {
  args: {
    onClickCancel: () => {},
    title: 'BottomSheet Title',
    children: <Typography variant="bodyLg">BottomSheet Content</Typography>,
  },
};

export const FormBottomSheet: Story = {
  args: {
    onClickCancel: () => {},
    title: 'User Information',
    children: (
      <form>
        <div>
          <TextInput
            label="Name:"
            name="input"
            onChange={() => {}}
            type="text"
            placeholder="Enter doctor's name"
            error={false}
          />
          <TextInput
            label="Category:"
            name="input"
            onChange={() => {}}
            type="text"
            placeholder=" Enter category"
            error={false}
            value=""
          />
        </div>
      </form>
    ),
  },
};
