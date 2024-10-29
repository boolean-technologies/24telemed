import { Flex, MessageResult, Typography } from '@local/shared-components';

import DoctorInfoComponent from './DoctorInfo';
import { usePersonnelCommunication } from '@local/websocket';
import { List } from 'antd-mobile';

type AvailableDoctorsProps = {
  patientId: string;
};

const AvailableDoctors = ({ patientId }: AvailableDoctorsProps) => {
  const { availableDoctors = [] } = usePersonnelCommunication();
  const fakeAvailableDoctors = [ 
    "72485e15-a00b-4b56-a9ec-50b9fcbfae22"
  ];
  return (
    <Flex direction="column" fullWidth fullHeight>
      <Flex direction="row" justify="space-between" gap="none">
        
      </Flex>
      <Flex
        direction="column"
        gap="sm"
        fullWidth
        fullHeight
        align="center"
        justify="center"
      >
        {fakeAvailableDoctors.length ? (
          <List style={{ width: '100%' }}>
            {fakeAvailableDoctors.map((doctorId) => (
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
