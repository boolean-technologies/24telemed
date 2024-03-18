import { render, screen } from '../testUtils';
import { fireEvent, cleanup } from '@testing-library/react';
import { NavLink } from './NavLink';
import { StarIcon } from '../Icon';
import { MemoryRouter } from 'react-router';
const navLinkProps = {
  to: '/',
  label: 'Home',
  color: 'black',
  topIcon: <StarIcon />,
  active: false,
};

describe('NavLink', () => {
  const Component = () => (
    <MemoryRouter>
      <NavLink {...navLinkProps} />
    </MemoryRouter>
  );
  const ActiveLinkComponent = () => (
    <MemoryRouter>
      <NavLink {...navLinkProps} active />
    </MemoryRouter>
  );
  it('renders a NavLink with the correct label', () => {
    render(<Component />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it("renders with default color 'primary1.main'", () => {
    render(<Component />);
    expect(screen.getByText('Home')).toHaveStyle('color: #2F4D52');
  });

  it('renders with active color', () => {
    render(<ActiveLinkComponent />);
    expect(screen.getByText('Home')).toHaveStyle('color: #FFFFFF');
  });

  it('should click on the NavLink', () => {
    const onClick = vi.fn();
    render(<Component />);
    fireEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
