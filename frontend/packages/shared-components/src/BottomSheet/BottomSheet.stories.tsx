import type { Meta, StoryFn } from '@storybook/react';
import {
  BottomSheetComponent,
  BottomSheetComponentProps,
} from './BottomSheetComponent';
import { TextInput } from '../Input';

export default {
  title: 'BottomSheet',
  component: BottomSheetComponent,
} as Meta;

const Template: StoryFn<BottomSheetComponentProps> = (args) => (
  <BottomSheetComponent {...args} />
);

export const Default = Template.bind({});

Default.args = {
  children: 'This is a bottom sheet content',
  title: 'Filter',
};

export const BottomSheetWithInput = Template.bind({});

BottomSheetWithInput.args = {
  ...Default.args,
  onClickCancel: () => {},
  children: (
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
  ),
};
