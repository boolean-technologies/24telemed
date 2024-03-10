import React from 'react'
import { DoctorAvatar } from '../../assets'
import { Flex, Typography, LocationIcon, SeeAllIcon, RatingStarIcon } from '@local/shared-components'
import styled from 'styled-components'
import { Card } from 'antd'




const AvailableDoctors = () => {
  return (
    <Flex direction="column" fullWidth fullHeight >
      <Flex direction="row" justify="space-between" gap="none">
      <Typography variant="bodyLg">Available Doctors</Typography>
      <Flex direction="row" gap="sm">
        <Typography variant="bodyXs" color='primary2.main'>See All</Typography>
        <SeeAllIcon />
        </Flex>
      </Flex>
      <Card>
        
      <DoctorInfo direction="row" justify='space-between'>
        <Flex >
        <DoctorImage src={DoctorAvatar} />
        
        <Flex direction="column" gap="none" >
          <Typography variant="bodyMd"> Dr Rotimi Adebayo </Typography>
          <Typography variant="bodyXs"> General Practitioner </Typography>
          <Flex direction="row" gap="sm">
            <LocationIcon />
            <Typography variant="bodyXs"> Lagos, Nigeria </Typography>
            </Flex>
        </Flex>
        </Flex>
        <Flex direction="row" gap="sm">
          <RatingStarIcon />
          <Typography variant="bodyXs"> 4.5 </Typography>
          <Typography variant="bodyXs"> (20) </Typography>
          </Flex>
      </DoctorInfo>
      </Card>
    </Flex>
  )
}

export default AvailableDoctors

const DoctorImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 40px;
    `
    const DoctorInfo = styled(Flex)`
    background-color: ${({ theme }) => theme.palette.common.white};
    `;