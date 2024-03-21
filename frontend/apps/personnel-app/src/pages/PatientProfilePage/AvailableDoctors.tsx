import { Flex, MessageResult, Typography } from '@local/shared-components';

import DoctorInfoComponent from './DoctorInfo';
import { usePersonnelCommunication } from '@local/websocket';
import { List } from 'antd-mobile';

type AvailableDoctorsProps = {
  patientId: string;
};

const AvailableDoctors = ({ patientId }: AvailableDoctorsProps) => {
  const { availableDoctors = [] } = usePersonnelCommunication();

  return (
    <Flex direction="column" fullWidth fullHeight>
      <Flex direction="row" justify="space-between" gap="none">
        <Typography variant="bodyLg">Available Doctors</Typography>
      </Flex>
      <Flex
        direction="column"
        gap="sm"
        fullWidth
        fullHeight
        align="center"
        justify="center"
      >
        {availableDoctors.length ? (
          <List style={{ width: '100%' }}>
            {availableDoctors.map((doctorId) => (
              <List.Item key={doctorId}>
                <DoctorInfoComponent
                  key={doctorId}
                  id={doctorId}
                  patientId={patientId}
                />
              </List.Item>
            ))}
          </List>
        ) : (
          <Flex padding="xl">
            <MessageResult
              icon="people-circle"
              title="No doctor is available at the moment."
              subTitle="Please check back later."
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AvailableDoctors;
