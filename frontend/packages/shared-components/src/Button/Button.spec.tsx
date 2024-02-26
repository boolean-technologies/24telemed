import { ByRoleOptions, mediaQueries, render, screen } from '../testUtils';

import { Button } from './Button';

const buttonProps = {
  text: 'Button',
  onClick: () => {},
};

const renderButton = (props = buttonProps) => {
  return render(<Button {...props} />);
};

describe('Button', () => {
  it('renders a button with the correct text', () => {
    renderButton();
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
  });

  it('renders a button with the correct text', () => {
    renderButton();
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
  });

  it('fires the onClick function when clicked', () => {
    const onClick = jest.fn();
    renderButton({ ...buttonProps, onClick });
    const button = screen.getByRole('button', { name: 'Button' });
    button.click();
    expect(onClick).toHaveBeenCalled();
  }
  );
});
