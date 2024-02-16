import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { TextInput as InputText, TextInputProps } from './TextInput';
import { StarIcon, NigeriaFlagIcon } from '../Icon';
import { PasswordInput, PasswordInputProps } from './PasswordInput';
import { FileInput } from './FileInput';
import { NumberInput } from './NumberInput';

const meta: Meta = {
  title: 'Input',
  component: InputText,
};

export default meta;

const Template: StoryFn<TextInputProps> = (args) => <InputText {...args} />;

export const Default = Template.bind({});

Default.args = {
  error: false,
  value: '',
  onChange: () => {},
  type: 'text',
  name: 'input',
};

export const LabelledTextInput: StoryObj<TextInputProps> = Template.bind({});

LabelledTextInput.args = {
  ...Default.args,
  label: 'Label',
};

export const HelperTextInput: StoryObj<TextInputProps> = Template.bind({});

HelperTextInput.args = {
  ...Default.args,
  helperText: 'Helper Text',
};

export const ErrorTextInput: StoryObj<TextInputProps> = Template.bind({});

ErrorTextInput.args = {
  ...Default.args,
  error: true,
  errorText: 'Error Text',
};

export const RightIconTextInput: StoryObj<TextInputProps> = Template.bind({});

RightIconTextInput.args = {
  ...Default.args,
  placeholder: 'placeholder',
  rightIcon: <StarIcon />,
};

export const LeftIconTextInput: StoryObj<TextInputProps> = Template.bind({});

LeftIconTextInput.args = {
  ...Default.args,
  placeholder: 'placeholder',
  leftIcon: <StarIcon />,
};

const TemplatePassword: StoryFn<PasswordInputProps> = (args) => (
  <PasswordInput {...args} />
);
export const PasswordInputStory = TemplatePassword.bind({});

PasswordInputStory.args = {
  error: false,
  value: '',
  onChange: () => {},
  name: 'input',
};


const TemplateFile: StoryFn<React.ComponentProps<typeof FileInput>> = (
  args
) => <FileInput {...args} />;
export const FileInputWithoutFile = TemplateFile.bind({});
FileInputWithoutFile.args = {
  onChange: (e) => console.log(e),
  placeholder: 'Add an attachment',

};

export const FileInputWithFile: StoryObj<
  React.ComponentProps<typeof FileInput>
> = TemplateFile.bind({});
FileInputWithFile.args = {
  ...FileInputWithoutFile.args,
  value: new File([''], 'filename'),
};

const NumberInputTemplate: StoryFn<React.ComponentProps<typeof NumberInput>> = (
  args
) => <NumberInput {...args} />;
export const NumberInputStory = NumberInputTemplate.bind({});

NumberInputStory.args = {
  error: false,
  value: '',
  onChange: () => {},
  name: 'input',
  label: 'Phone Number',
};

export const PhoneNumberInputWithFlag: StoryObj<
  React.ComponentProps<typeof NumberInput>
> = NumberInputTemplate.bind({});
PhoneNumberInputWithFlag.args = {
  ...NumberInputStory.args,
  leftIcon: <NigeriaFlagIcon />,
};
