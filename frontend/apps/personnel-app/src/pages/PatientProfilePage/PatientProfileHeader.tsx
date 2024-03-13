import { Patient } from '@local/api-generated'
import { Flex, Typography } from '@local/shared-components'
import React from 'react'
import styled from 'styled-components'
import { UserAvatar } from '../../assets'

type Props = {
    patient: Patient
}

const PatientProfileHeader = ({ patient }: Props) => {
    const patientName = `${patient.first_name} ${patient.last_name}`
  return (
    <StyledHeader fullWidth padding="xxl" justify="space-between">
      <Flex direction="row" gap="none">
        <UserImage src={UserAvatar} alt="User Avatar" />
        <Flex direction="column" gap="xs">
        <Flex direction="row" gap="xs">
          <Typography variant="bodyXl" weight="bold">
            {patientName}
          </Typography>
          <Typography variant="bodyXl" weight="bold">
            ({patient.age}yrs)
          </Typography>
          <Typography variant="bodyXl" weight="bold">
            ({patient.gender.charAt(0)})
          </Typography>
        </Flex>

        <Flex direction="row" gap="none">
          <Typography variant="bodyMd" >
            {patient.phone_number}
          </Typography>
          <Typography variant="bodyMd" >
            {patient.email}
          </Typography>
          </Flex>
        </Flex>
      </Flex>
    </StyledHeader>
  )
}

export default PatientProfileHeader

const StyledHeader = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.primary2.main};
  border-bottom-left-radius: ${({ theme }) => theme.spacing.xl};
  border-bottom-right-radius: ${({ theme }) => theme.spacing.xl};
  height: 150px;
  padding-left: 10%;

`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.spacing.xl};
`;
