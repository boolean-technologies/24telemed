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
    <Flex direction="column" fullWidth padding="xl" smPadding="md" justify="center">
      <Flex direction="column">
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
      <Flex direction="column">
        {new Array(10).fill(data[0]).map((patient) => (
          <PatientFountItem key={patient.id} patient={patient} />
        ))}
      </Flex>
    </Flex>
  );
};

export default PatientFound;
