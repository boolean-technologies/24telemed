import {
  Flex,
  MedicalHistory,
  PatientProfileHeader,
  addAlpha,
} from '@local/shared-components';
import styled from 'styled-components';
import { useGetPatient } from '../../../hooks/patients';
import { useCallContext } from '../../../context/AppContext';


export function PatientProfile() {
  const { patientId } = useCallContext();
  const { data: patient } = useGetPatient(patientId);

  if (!patient) return null;
  return (
    <StyledRoot direction="column" fullHeight fullWidth gap="none">
      <StyledContainer direction="column" fullHeight fullWidth gap="none">
        <PatientProfileHeader patient={patient} inCall />
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
      </StyledContainer>
    </StyledRoot>
  );
}

const TabContainer = styled(Flex)`
  background-color: ${({ theme }) => addAlpha(theme.palette.common.black, 0.1)};
  border-top-right-radius: ${({ theme }) => theme.spacing.sm};
  border-top-left-radius: ${({ theme }) => theme.spacing.sm};
`;


const StyledRoot = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.primary2.main};
  position: relative;
`;

const StyledContainer = styled(Flex)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
`;