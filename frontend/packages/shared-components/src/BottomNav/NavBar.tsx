import styled from 'styled-components';

import { ReactElement } from 'react';
interface NavigationContainerProps {
  children: ReactElement;
}
export const StyledNavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs}
    ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.palette.common.white};
  width: fit-content;
`;

export function NavBar({
  children,
}: NavigationContainerProps): JSX.Element {
  return <StyledNavigationContainer>{children}</StyledNavigationContainer>;
}
