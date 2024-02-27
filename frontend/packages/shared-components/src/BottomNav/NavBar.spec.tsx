import { render, screen } from '../testUtils';
import { NavBar } from './NavBar';
import { MemoryRouter } from 'react-router';
import { NavLink } from './NavLink';
import { StarIcon } from '../Icon';

describe('NavBar', () => {
  const Component = () => (
    <MemoryRouter>
      <NavBar>
        <NavLink
          to="/"
          label="Home"
          color="black"
          topIcon={<StarIcon />}
          active={false}
        />
        <NavLink
          to="/about"
          label="About"
          color="black"
          topIcon={<StarIcon />}
          active={false}
        />
        <NavLink
          to="/contact"
          label="Contact"
          color="black"
          topIcon={<StarIcon />}
          active={false}
        />
      </NavBar>
    </MemoryRouter>
  );
  it('renders a NavBar with the correct number of NavLinks', () => {
    render(<Component />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('renders a NavBar with the correct number of NavLinks', () => {
    render(<Component />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });
});
