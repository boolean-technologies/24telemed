import styled from 'styled-components';
import { Link } from 'react-router-dom';
import React from 'react';

export interface NavigationBarProps {
  to: string;
  label: string;
  color: string;
  topIcon: React.ReactNode;
  active: boolean;
}

export function NavLink({ ...props }: NavigationBarProps): JSX.Element {
  return (
    <StyledLink {...props} to={props.to}>
      <LinkContainer active={props.active}>
        <IconContainer>{props.topIcon}</IconContainer>
        <Label active={props.active}>{props.label}</Label>
      </LinkContainer>
    </StyledLink>
  );
}

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

const LinkContainer = styled.div<Pick<NavigationBarProps, 'active'>>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme, active }) =>
    active ? theme.palette.primary1.main : 'transparent'};
  width: 100px;
  border-radius: 10px;
  align-items: center;
  height: 60px;
  padding: ${({ theme }) => theme.spacing.xs};
`;

const StyledLink = styled(Link)<NavigationBarProps>`
  text-decoration: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.navigationButton.fontFamily};
`;

const Label = styled.div<Pick<NavigationBarProps, 'active'>>`
  color: ${({ theme, active }) =>
    active ? theme.palette.common.white : theme.palette.primary1.main};
`;


