import { PatientSearch } from '@local/api-generated';
import { Flex, FoundIcon, Typography } from '@local/shared-components';
import { List } from 'antd-mobile';
import { PatientFountItem } from './PatientFountItem';

type Props = {
  data: PatientSearch[];
};

const PatientFound = ({ data }: Props) => {
  const totalPatients = data.length;

  return (
    <Flex direction="column" fullWidth padding="xl" justify="center">
      <Flex padding="xs" direction="column">
        <Flex fullWidth direction="row">
          <FoundIcon />
          <Typography variant="bodyLg" weight="bold">
            {totalPatients} patient(s) found
          </Typography>
        </Flex>
        <Typography variant="bodyLg" >
          Please click to confirm & access the patient profile.
        </Typography>
      </Flex>
      <List style={{ margin: 0 }}>
        {data.map((patient) => (
          <List.Item key={patient.id}>
            <PatientFountItem patient={patient} />
          </List.Item>
        ))}
      </List>
    </Flex>
  );
};

export default PatientFound;
