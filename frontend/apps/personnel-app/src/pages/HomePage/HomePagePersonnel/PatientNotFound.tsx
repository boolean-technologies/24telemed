import { Flex, IonIcon, Typography } from '@local/shared-components';
import { Button } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { Path } from '../../../constants';


type PatientNotFoundProps = {
  phoneNumber: string;
  onSearchAnother: () => void;
};

export function PatientNotFound({ phoneNumber, onSearchAnother }: PatientNotFoundProps) {
  return (
    <Flex direction="column" fullWidth padding="xl" justify="center" gap="xl">
      <Flex fullWidth direction="column" align="center" padding="xs">
        <IonIcon name="alert-circle" size={100} color="error" />
        <Typography variant="h4" weight="bold">
          No record found
        </Typography>
        <Typography variant="bodyLg">
          The phone number <strong>({phoneNumber})</strong> does not exist in
          our record
        </Typography>
      </Flex>
        <Flex fullWidth padding="none" justify="center">
          <Link to={Path.registerPatient}>
          <Button color="primary" fill="solid">
            Create new patient record
          </Button>
          </Link>
          <Button onClick={onSearchAnother}>
            Use another number
          </Button>
        </Flex>
    </Flex>
  );
}
