import { SvgIconProps } from '../Icon/SvgIcon';
import { Flex } from '../Flex';
import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';


export interface NavigationBarProps {
  to: string;
  label: string;
  color: string;
  topIcon: (props: SvgIconProps) => JSX.Element;
}
export function NavLink({
  topIcon: Icon,
  ...props
}: NavigationBarProps): JSX.Element {
  return (
    <StyledLink to={props.to}>
      <LinkContainer
        direction="column"
        justify="center"
        align="center"
        gap="xxs"
      >
        <IconContainer justify="center" align="center">
          <Icon  />
        </IconContainer>
        <Label>{props.label}</Label>
      </LinkContainer>
    </StyledLink>
  );
}

const LinkContainer = styled(Flex)`
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing.xs};
`;
const StyledLink = styled(RouterNavLink)`
  text-decoration: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.navigationButton.fontFamily};
  gap: ${({ theme }) => theme.spacing.xxs};
  &.active {
    background-color: ${({ theme }) => theme.palette.primary1.main};
    color: ${({ theme }) => theme.palette.common.white};
  }
  border-radius: 10px;
`;

const Label = styled.div`
  font-family: ${({ theme }) => theme.typography.navigationButton.fontFamily};
  font-size: ${({ theme }) => theme.typography.navigationButton.fontSize};

  text-align: center;
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.navigationButton.fontWeight};
  line-height: 1.2;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.xxs};
  text-align: center;
`;

const IconContainer = styled(Flex)`
  width: fit-content;
`;
