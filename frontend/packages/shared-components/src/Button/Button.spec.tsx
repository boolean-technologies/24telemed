import { render, screen } from '../testUtils';
import { fireEvent, cleanup } from '@testing-library/react'
import { Button } from './Button';

const buttonProps = {
  text: 'Button',
  onClick: vi.fn(),
};

const renderButton = (props = buttonProps) => {
  return render(<Button {...props} />);
};

describe('Button', () => {
  afterEach(cleanup);
  it('renders a button with the correct text', () => {
    renderButton();
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
  });

  it('renders a button with the correct text', () => {
    renderButton();
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
  });

  it('fires the onClick function when clicked', () => {
    const onClick = buttonProps.onClick;
    renderButton({ ...buttonProps, onClick });
    const button = screen.getByRole('button', { name: 'Button' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
