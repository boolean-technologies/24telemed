import { useNavigate, useParams } from 'react-router-dom';
import { useGetPatient } from '../../api/patient';
import {
  Flex,
  PageLoading,
  FlexProps,
} from '@local/shared-components';
import styled from 'styled-components';
import PatientProfileHeader from './PatientProfileHeader';
import Tab from './Tab';
import { Drawer } from 'antd';
import { Modal } from 'antd-mobile';
export function PatientProfilePage() {
  const { patientId } = useParams();
  const { data: patient, isLoading } = useGetPatient(patientId || '');
  const navigate = useNavigate();

  const onCloseProfile = () => {
    Modal.confirm({
      title: "Close Profile",
      content: "Are you sure you want to close this patient profile?",
      confirmText: "Yes, Close",
      cancelText: "Cancel",
      onConfirm: () => navigate(-1),
    })
  }

  if (isLoading) return <PageLoading />;

  if (!patient) return null;
  
  return (
    <Drawer title="Patient Profile" onClose={onCloseProfile} open width="100%">
      <Root direction="column" fullHeight fullWidth gap="lg">
        <PatientProfileHeader patient={patient} />
        <TabContainer align="center" justify="center">
          <Tab patient={patient} />
        </TabContainer>
      </Root>
    </Drawer>
  );
}

const TabContainer = styled(Flex)``;

const Root = styled(Flex)<FlexProps>`
  background-color: ${({ theme }) => theme.palette.common.white};
`;
