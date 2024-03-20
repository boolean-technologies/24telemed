import { PatientSearch } from '@local/api-generated';
import { Flex, IonIcon, Typography } from '@local/shared-components';
import { Image } from 'antd-mobile';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Path } from '../../constants';

type PatientFountItemProps = {
  patient: PatientSearch;
};

export function PatientFountItem({ patient }: PatientFountItemProps) {
  return (
    <Link to={Path.patient+"/"+patient.id}>
      <Flex fullWidth justify="space-between">
        <Flex>
          <StyledIconWrapper justify="center">
            {patient.photo ? (
              <Image src={patient.photo} width={60} height={60} fit="contain" />
            ) : (
              <IonIcon name="person" outlined color="primary2.main" size="lg" />
            )}
          </StyledIconWrapper>

          <Flex direction="column" gap="none">
            <Typography variant="bodyMd" weight="bold">
              {patient.first_name} {patient.last_name}
            </Typography>
            <Typography color="primary1.light">
              ID: {patient.phone_number}
            </Typography>
            <Typography color="primary1.light">
              Gender: {patient.gender}
            </Typography>
            <Typography color="primary1.light">
              Location: {patient.address}
            </Typography>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}

const StyledIconWrapper = styled(Flex)`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  border: ${({ theme }) => theme.border.primary.main};
  background: ${({ theme }) => theme.palette.primary1.main};
  overflow: hidden;
`;
