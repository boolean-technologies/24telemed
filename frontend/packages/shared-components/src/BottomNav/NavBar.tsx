import styled from 'styled-components';

import { ReactElement } from 'react';
import { Flex, FlexProps } from '../Flex';
interface NavigationContainerProps {
  children: ReactElement[] | ReactElement;
}

export function NavBar({ children }: NavigationContainerProps): JSX.Element {
  return <StyledRoot justify="space-between" >{children}</StyledRoot>;
}

const StyledRoot = styled(Flex)<FlexProps>`
  background-color: ${({ theme }) => theme.palette.common.white};
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`;
