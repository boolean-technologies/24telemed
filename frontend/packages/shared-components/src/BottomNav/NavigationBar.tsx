import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface NavigationBarProps {
  to: string;
  label: string;
  color: string;
  backgroundColor: string;
}

const StyledLink = styled(Link)<NavigationBarProps>`
  background-color: 'blue';
  color: 'black';
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: lightgrey;
  }
  &:active {
    background-color: grey;
  }
  font-family: ${({ theme }) => theme.typography.navigationButton.fontFamily};
`;

export function NavigationBar(props: NavigationBarProps) {
  return (
    <StyledLink {...props} to={props.to}>
      {props.label}
    </StyledLink>
  );
}
