import {
  Flex,
  LocationIcon,
  RatingStarIcon,
  Typography,
} from '@local/shared-components';
import React from 'react';
import styled from 'styled-components';

type Props = {
  id: string;
  name: string;
  speciality: string;
  location: string;
  rating: number;
  totalRating: number;
  avatar: string;
};

const DoctorInfoComponent = ({
    id,
  name,
  speciality,
  location,
  rating,
  totalRating,
    avatar, 
}: Props) => {
  return (
    <DoctorInfo direction="row" justify="space-between">
      <Flex>
        <DoctorImage src={avatar} alt="doctor" />

        <Flex direction="column" gap="none">
          <Typography variant="bodyMd"> {name} </Typography>
          <Typography variant="bodyXs"> {speciality} </Typography>
          <Flex direction="row" gap="sm">
            <LocationIcon />
            <Typography variant="bodyXs"> {location} </Typography>
          </Flex>
        </Flex>
      </Flex>
      <Flex direction="row" gap="sm">
        <RatingStarIcon />
        <Typography variant="bodyXs"> {rating} </Typography>
        <Typography variant="bodyXs"> ({totalRating}) </Typography>
      </Flex>
    </DoctorInfo>
  );
};

export default DoctorInfoComponent;

const DoctorImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;
const DoctorInfo = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
`;
