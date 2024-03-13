import React from 'react';
import { DoctorAvatar } from '../../assets';
import { Flex, Typography, SeeAllIcon } from '@local/shared-components';

import DoctorInfoComponent from './DoctorInfo';
import { Card } from 'antd';

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
