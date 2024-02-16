import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { TextInput } from './TextInput';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../styles/defaultTheme';


describe('TextInput', () => {
  it('should render an helper text when provided', () => {
    render(
      <ThemeProvider theme={defaultTheme}>
        <TextInput
          value="value"
          placeholder="placeholder"
          onChange={() => {}}
          error={false}
          name="name"
          type="text"
          helperText="helper text"
        />
      </ThemeProvider>
    );
    expect(screen.getByText('helper text')).toBeInTheDocument();
  })

    it('should render an error text when provided', () => {
        render(
        <ThemeProvider theme={defaultTheme}>
            <TextInput
            value="value"
            placeholder="placeholder"
            onChange={() => {}}
            error={true}
            name="name"
            type="text"
            errorText="error text"
            />
        </ThemeProvider>
        );
        expect(screen.getByText('error text')).toBeInTheDocument();
    })
});