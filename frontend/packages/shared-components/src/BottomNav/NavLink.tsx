import { SvgIconProps } from '../Icon/SvgIcon';
import { Flex, FlexProps } from '../Flex';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface NavigationBarProps {
  to: string;
  label: string;
  color: string;
  active: boolean;
  topIcon: (props: SvgIconProps) => JSX.Element;
}
export function NavLink({
  topIcon: Icon,
  ...props
}: NavigationBarProps): JSX.Element {
  return (
    <StyledLink to={props.to}>
      <LinkContainer
        active={props.active}
        direction="column"
        justify="center"
        align="center"
        gap="xxs"
      >
        <IconContainer justify="center" align="center">
          <Icon color={props.active ? 'primary1.main' : 'common.white'} />
        </IconContainer>
        <Label active={props.active}>{props.label}</Label>
      </LinkContainer>
    </StyledLink>
  );
}

const LinkContainer = styled(Flex)<Pick<NavigationBarProps, 'active'>>`
  background-color: ${({ theme, active }) =>
    active ? theme.palette.primary1.main : 'transparent'};
  width: 100px;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing.xs};
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.navigationButton.fontFamily};
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const Label = styled.div<Pick<NavigationBarProps, 'active'>>`
  color: ${({ theme, active }) =>
    active ? theme.palette.common.white : theme.palette.primary1.main};
`;

const IconContainer = styled(Flex)`
  width: fit-content;
`;
