import '@testing-library/jest-dom/extend-expect';
import { Button } from './Button';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../styles/defaultTheme';

const TestButton = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Button text="Click me" />
    </ThemeProvider>
  );
};

describe('Button', () => {
  it('should render the button', () => {
    render(<TestButton />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<TestButton />);
    expect(container).toMatchSnapshot();
  });

    it('should call the onClick function', () => {
        // @ts-ignore
        const onClick = jest.fn();
        render(<Button text="Click me" onClick={onClick} />);
        fireEvent.click(screen.getByText('Click me'));
        expect(onClick).toHaveBeenCalled();
    });

});
