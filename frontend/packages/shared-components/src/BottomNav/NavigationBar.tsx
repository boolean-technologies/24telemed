import styled from 'styled-components';
import { Link } from 'react-router-dom';
import React from 'react';

export interface NavigationBarProps {
  to: string;
  label: string;
  color: string;
  backgroundColor: string;
  topIcon: React.ReactNode;
  active: boolean;
}

export function NavigationBar({ ...props }: NavigationBarProps): JSX.Element {
  return (
    <StyledLink {...props} to={props.to}>
      <LinkContainer active={props.active}>
        <TopIconContainer>{props.topIcon}</TopIconContainer>
        <Label active={props.active}>{props.label}</Label>
      </LinkContainer>
    </StyledLink>
  );
}

const TopIconContainer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

const LinkContainer = styled.div<Pick<NavigationBarProps, 'active'>>`
  display: flex;
  background-color: ${({ theme, active }) =>
    active ? theme.palette.primary1.main : 'transparent'};
  width: 120px;
  height: 60px;
  border-radius: 20px;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`;

const StyledLink = styled(Link)<NavigationBarProps>`
  text-decoration: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.navigationButton.fontFamily};
`;

const Label = styled.div<Pick<NavigationBarProps, 'active'>>`
  color: ${({ theme, active }) => active ? theme.palette.primary1.main : theme.palette.primary1.light};
`;
