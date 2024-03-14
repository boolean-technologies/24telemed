import { Flex, Typography } from '@local/shared-components';

import DoctorInfoComponent from './DoctorInfo';
import { Card } from 'antd';
import { usePersonnelCommunication } from '@local/websocket';
import { Modal } from 'antd-mobile';

const AvailableDoctors = () => {
  const { availableDoctors = [] } = usePersonnelCommunication();

  return (
    <Flex direction="column" fullWidth fullHeight>
      <Flex direction="row" justify="space-between" gap="none">
        <Typography variant="bodyLg">Available Doctors</Typography>
      </Flex>
      <Card>
        <Flex direction="column" gap="sm" fullWidth fullHeight>
          {availableDoctors.map((doctorId) => (
            <DoctorInfoComponent
              key={doctorId}
              id={doctorId}
            />
          ))}
        </Flex>
      </Card>
    </Flex>
  );
};

export default AvailableDoctors;
