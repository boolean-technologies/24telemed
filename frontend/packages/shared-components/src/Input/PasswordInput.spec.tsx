import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import {PasswordInput} from './PasswordInput';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../styles/defaultTheme';

describe('PasswordInput', () => {
  it('should render', () => {
    render(
      <ThemeProvider theme={defaultTheme}>
        <PasswordInput
          value="value"
          placeholder="placeholder"
          onChange={() => {}}
          error={false}
          name="name"
          type="text"
        />
      </ThemeProvider>
    );
    expect(screen.getByPlaceholderText('placeholder')).toBeInTheDocument();
  });
});