import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { Input, InputProps } from './Input';
import { ThemeProvider } from 'styled-components';
import { theme } from '../config';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from 'react-hook-form';
import { FaBeer } from 'react-icons/fa';

type Story = StoryObj<typeof Input>;

type FormDataType = {
  input: string;
};

const Template: StoryFn<InputProps> = (args) => {
  const schema = yup.object().shape({
    input: yup.string().required(),
  });

  const method = useForm<FormDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      input: '',
    },
  });

  console.log(method.watch('input'));

  return <Input {...args} control={method.control} value= {method.watch('input')} />;
};

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

export const Default = Template.bind({});
Default.args = {
  name: 'input',
  label: 'Field Label',
  placeholder: 'Type here...',
  type: 'text',
};

export default meta;

export const InputTextWithoutLabel = Template.bind({});

InputTextWithoutLabel.args = {
  name: 'input',
  placeholder: 'Type here...',
  type: 'text',
  value: '',
};

export const InputTextwithRightIcon = Template.bind({});

InputTextwithRightIcon.args = {
  name: 'input',
  label: 'Field Label',
  placeholder: 'Type here...',
  type: 'text',
  value: '',
  inputRightIcon: <FaBeer />,
};

export const InputTextwithLeftIcon = Template.bind({});
InputTextwithLeftIcon.args = {
  name: 'input',
  label: 'Field Label',
  placeholder: 'Type here...',
  type: 'text',
  value: '',
  inputLeftIcon: <FaBeer />,
};

export const InputTextWithHelperText = Template.bind({});
InputTextWithHelperText.args = {
  name: 'input',
  label: 'Field Label',
  placeholder: 'Type here...',
  type: 'text',
  value: '',
  helperText: 'This is a helper text',
};

export const InputTextWithError = Template.bind({});

InputTextWithError.args = {
  name: 'input',
  label: 'Field Label',
  placeholder: 'Type here...',
  type: 'text',
  value: '',
  error: 'This is an error',
};

export const InputFileWithLabel = Template.bind({});

InputFileWithLabel.args = {
  name: 'input',
  label: 'Upload file',
  type: 'file',
  value: '',
  placeholder: 'Add attachment...',
};

export const InputFileWithHelperText = Template.bind({});

InputFileWithHelperText.args = {
  name: 'input',
  label: 'Upload file',
  type: 'file',
  value: '',
  placeholder: 'Add attachment...',
  helperText: 'This is a helper text',
};

export const InputFileWithError = Template.bind({});

InputFileWithError.args = {
  name: 'input',
  label: 'Upload file',
  type: 'file',
  value: '',
  placeholder: 'Add attachment...',
  error: 'This is an error',
};

export const InputFileWithValue = Template.bind({});

InputFileWithValue.args = {
  name: 'input',
  label: 'Upload file',
  type: 'file',
  value: 'file.txt',
  placeholder: 'Add attachment...',
};

export const PasswordInput = Template.bind({});

PasswordInput.args = {
  name: 'input',
  label: 'Password',
  type: 'password',
  value: '',
  placeholder: 'Type here...',
};
