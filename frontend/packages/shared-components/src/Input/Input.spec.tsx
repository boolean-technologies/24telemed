import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, renderHook } from '@testing-library/react';
import { Input } from './Input';
import { useForm } from 'react-hook-form';
import { ThemeProvider } from 'styled-components';
import { theme } from '../config';
type FormDataType = {
  input: string;
};
describe('Input', () => {
  const { result } = renderHook(() => useForm<FormDataType>({
    defaultValues: {
      input: '',
    },
  }));

  it('renders an input', () => {
    render(
      <ThemeProvider theme={theme}>
        <Input
          control={result.current.control}
          name="input"
          label="Field Label"
          placeholder="Type here..."
          type="text"
          value=""
        />
      </ThemeProvider>
    );
    const input = screen.getByPlaceholderText('Type here...');
    expect(input).toBeInTheDocument();
  });

  it('renders a label', () => {
    render(
      <ThemeProvider theme={theme}>
        <Input
          control={result.current.control}
          name="input"
          label="Field Label"
          placeholder="Type here..."
          type="text"
          value=""
        />
      </ThemeProvider>
    );
    const label = screen.getByText('Field Label');
    expect(label).toBeInTheDocument();
  });

  it('renders a file input', () => {
    render(
      <ThemeProvider theme={theme}>
        <Input
          control={result.current.control}
          name="input"
          label="Field Label"
          placeholder="Type here..."
          type="file"
          value=""
        />
      </ThemeProvider>
    );
    const input = screen.getByPlaceholderText('Type here...');
    expect(input).toBeInTheDocument();
  });

  it('renders a file label', () => {
    render(
      <ThemeProvider theme={theme}>
        <Input
          control={result.current.control}
          name="input"
          label="Field Label"
          placeholder="Type here..."
          type="file"
          value=""
        />
      </ThemeProvider>
    );
    const label = screen.getByText('Field Label');
    expect(label).toBeInTheDocument();
  });

  it('renders a file input with a file icon', () => {
    render(
      <ThemeProvider theme={theme}>
        <Input
          control={result.current.control}
          name="input"
          label="Field Label"
          placeholder="Type here..."
          type="file"
          value=""
        />
      </ThemeProvider>
    );
    const icon = screen.getByAltText('attachment');
    expect(icon).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <Input
          control={result.current.control}
          name="input"
          label="Field Label"
          placeholder="Type here..."
          type="text"
          value=""
        />
      </ThemeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  }
  );

  
});
