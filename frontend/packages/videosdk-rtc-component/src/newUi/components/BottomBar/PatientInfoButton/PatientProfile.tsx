import {
  Flex,
  MedicalHistory,
  PatientProfileHeader,
} from '@local/shared-components';
import styled from 'styled-components';
import { useGetPatient } from '../../../hooks/patients';

type PatientProfileProps = {
  patientId?: string;
};

export function PatientProfile({ patientId }: PatientProfileProps) {
  const { data: patient } = useGetPatient(patientId);

  if (!patient) return null;
  return (
    <Flex direction="column" fullHeight fullWidth gap="none">
      <PatientProfileHeader patient={patient} />
      <TabContainer
        align="flex-start"
        justify="flex-start"
        fullHeight
        fullWidth
        padding="lg"
        flex={1}
        direction="column"
      >
        <MedicalHistory patient={patient} />
      </TabContainer>
    </Flex>
  );
}

const TabContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.primary1.main};
  border-top-right-radius: ${({ theme }) => theme.spacing.sm};
  border-top-left-radius: ${({ theme }) => theme.spacing.sm};
`;
