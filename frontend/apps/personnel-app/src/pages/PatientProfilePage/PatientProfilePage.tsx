import { useParams } from 'react-router-dom';
import { useGetPatient } from '../../api/patient';
import {
  Flex,
  PageLoading,
  FlexProps,
} from '@local/shared-components';
import styled from 'styled-components';
import PatientProfileHeader from './PatientProfileHeader';
import Tab from './Tab';
export function PatientProfilePage() {
  const { patientId } = useParams();
  const { data: patient, isLoading } = useGetPatient(patientId || '');

  if (isLoading) return <PageLoading />;

  if (!patient) return null;
  
  return (
    <Root direction="column" fullHeight fullWidth>
      <PatientProfileHeader patient={patient} />
      <TabContainer align="center" justify="center">
        <Tab patient={patient} />
      </TabContainer>
    </Root>
  );
}

const TabContainer = styled(Flex)``;

const Root = styled(Flex)<FlexProps>`
  background-color: ${({ theme }) => theme.palette.common.white};
`;
