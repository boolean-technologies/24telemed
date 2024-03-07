import styled from 'styled-components';

import { ReactElement } from 'react';
import { Flex } from '../Flex';
interface NavigationContainerProps {
  children: ReactElement[] | ReactElement;
}

export function NavBar({ children }: NavigationContainerProps): JSX.Element {
  return <StyledRoot justify="space-between">{children}</StyledRoot>;
}

const StyledRoot = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
`;
