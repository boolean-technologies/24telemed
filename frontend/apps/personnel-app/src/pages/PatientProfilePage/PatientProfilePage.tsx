import { useNavigate, useParams } from 'react-router-dom';
import { useGetPatient } from '../../api/patient';
import { Flex, PageLoading, FlexProps, Theme } from '@local/shared-components';
import styled, { useTheme } from 'styled-components';
import PatientProfileHeader from './PatientProfileHeader';
import { Badge, Drawer, Tabs } from 'antd';
import { Modal } from 'antd-mobile';
import MedicalHistory from './MedicalHistory';
import AvailableDoctors from './AvailableDoctors';
import { usePersonnelCommunication } from '@local/websocket';

export function PatientProfilePage() {
  const { patientId } = useParams();
  const { data: patient, isPending } = useGetPatient(patientId);
  const navigate = useNavigate();
  const { availableDoctors } = usePersonnelCommunication();

  const theme = useTheme() as Theme;

  const onCloseProfile = () => {
    Modal.confirm({
      title: 'Close Profile',
      content: 'Are you sure you want to close this patient profile?',
      confirmText: 'Yes, Close',
      cancelText: 'Cancel',
      onConfirm: () => navigate(-1),
    });
  };

  if (isPending) return <PageLoading />;

  if (!patient) return null;

  return (
    <Drawer
      title="Patient Profile"
      onClose={onCloseProfile}
      open
      width="100%"
      styles={{
        body: { padding: 0, background: theme.palette.primary2.main },
        header: { background: theme.palette.primary2.main },
      }}
    >
      <Flex direction="column" fullHeight fullWidth gap="lg">
        <PatientProfileHeader patient={patient} />
        <TabContainer align="flex-start" justify="center" fullHeight fullWidth padding="lg">
        <Tabs
          defaultActiveKey="medicalHistory"
          type="card"
          tabBarStyle={{
            width: `calc(100vw - 2 * ${theme.spacing.lg})`,
          }}
          tabBarGutter={8}
          items={[
            {
              key: 'medicalHistory',
              label: 'Medical History',
              children: <MedicalHistory patient={patient} />,
            },
            {
              key: 'availableDoctors',
              label: (
                <>
                  Available Doctors{' '}
                  <Badge
                    count={availableDoctors.length}
                    style={{ fontWeight: 'bold' }}
                  />
                </>
              ),
              children: <AvailableDoctors  />,
            },
          ]}
        />
        </TabContainer>
      </Flex>
    </Drawer>
  );
}

const TabContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
  border-top-right-radius: ${({ theme }) => theme.spacing.xl};
  border-top-left-radius: ${({ theme }) => theme.spacing.xl};
`;
