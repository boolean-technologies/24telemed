import React from 'react';
import { DoctorAvatar } from '../../assets';
import {
  Flex,
  Typography,
  LocationIcon,
  SeeAllIcon,
  RatingStarIcon,
} from '@local/shared-components';
import styled from 'styled-components';
import { Card } from 'antd';
import DoctorInfoComponent from './DoctorInfo';

type DoctorsType = {
  id: string;
  name: string;
  speciality: string;
  location: string;
  rating: number;
  totalRating: number;
};

type Props = {
  doctors: DoctorsType[];
};

const AvailableDoctors = ({ doctors }: Props) => {
  return (
    <Flex direction="column" fullWidth fullHeight>
      <Flex direction="row" justify="space-between" gap="none">
        <Typography variant="bodyLg">Available Doctors</Typography>
        <Flex direction="row" gap="sm">
          <Typography variant="bodyXs" color="primary2.main">
            See All
          </Typography>
          <SeeAllIcon />
        </Flex>
      </Flex>
      <Card>
        <Flex direction="column" gap="sm" fullWidth fullHeight>
          {doctors.map((doctor) => (
            <DoctorInfoComponent
              key={doctor.id}
              name={doctor.name}
              speciality={doctor.speciality}
              location={doctor.location}
              rating={doctor.rating}
              totalRating={doctor.totalRating}
              avatar={DoctorAvatar}
              id={doctor.id}
            />
          ))}
        </Flex>
      </Card>
    </Flex>
  );
};

export default AvailableDoctors;

const SellAllContainer = styled(Flex)`
  cursor: pointer;
`;
