import styled from 'styled-components';
import { Link } from 'react-router-dom';
import React from 'react';

export interface NavigationBarProps {
  to: string;
  label: string;
  color: string;
  backgroundColor: string;
  topIcon: React.ReactNode;
}

const StyledLink = styled(Link)<NavigationBarProps>`
  background-color: 'black';
  color: 'black';
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.typography.navigationButton.fontFamily};
`;

export function NavigationBar(props: NavigationBarProps) {
  return (
    <StyledLink {...props} to={props.to}>
      <LinkContainer>
        <TopIconContainer>
          {props.topIcon}
          <Label>{props.label}</Label>
        </TopIconContainer>
      </LinkContainer>
    </StyledLink>
  );
}

const TopIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-radius: ${({ theme }) =>
    theme.typography.navigationButton.borderRadius};
  width: fit-content;

  :hover {
    background-color: ${({ theme }) => theme.palette.primary1.light};
  }
`;

const Label = styled.p`
  margin: 0;
`;

const LinkContainer = styled.div`
  display: flex;
  
`;
