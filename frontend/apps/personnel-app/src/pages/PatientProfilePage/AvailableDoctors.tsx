import { Flex, Typography, Card } from '@local/shared-components';

import DoctorInfoComponent from './DoctorInfo';
import { usePersonnelCommunication } from '@local/websocket';
import { List } from 'antd-mobile';
import { Empty } from 'antd';

const AvailableDoctors = () => {
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
          <List style={{ width: "100%" }}>
            {availableDoctors.map((doctorId) => (
              <List.Item key={doctorId}>
                <DoctorInfoComponent key={doctorId} id={doctorId} />
              </List.Item>
            ))}
          </List>
        ) : (
          <Flex padding="xl">
            <Empty
              description={
                <Typography align="center" variant="bodyLg">
                  No doctor is available at the moment. <br />
                  Please check back later.
                </Typography>
              }
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AvailableDoctors;
