import { Flex, Typography } from '@local/shared-components'
import React from 'react'
import styled from 'styled-components'


const Header = (): JSX.Element => {
  return (
    <StyledHeader fullWidth padding="xl">
      <Flex direction='column' >
        {/* TODO - replace with user's name */}
        <Typography >Hi Jane Doe,</Typography>
        <Typography variant="h5">Welcome to your assistant view </Typography>
      </Flex>
    </StyledHeader>
  )
}

const StyledHeader = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.primary2.main};
  border-bottom-left-radius: ${({ theme }) => theme.spacing.xl};
  border-bottom-right-radius: ${({ theme }) => theme.spacing.xl};
  height: 150px;
`;


export default Header
