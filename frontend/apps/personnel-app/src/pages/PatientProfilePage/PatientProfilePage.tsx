import { useNavigate, useParams } from 'react-router-dom';
import { useGetPatient } from '../../api/patient';
import {
  Flex,
  PageLoading,
  Theme,
  PatientProfileHeader,
  MedicalHistory,
} from '@local/shared-components';
import styled, { useTheme } from 'styled-components';
import { Badge, Drawer, Segmented, Tabs } from 'antd';
import { Modal } from 'antd-mobile';
import AvailableDoctors from './AvailableDoctors';
import { usePersonnelCommunication } from '@local/websocket';
import { useState } from 'react';

export function PatientProfilePage() {
  const { patientId } = useParams();
  const { data: patient, isPending } = useGetPatient(patientId);
  const navigate = useNavigate();
  const { availableDoctors } = usePersonnelCommunication();
  const [value, setValue] = useState<string>('medicalHistory');
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
      <Flex direction="column" fullHeight fullWidth gap="lg" xsGap="xs">
        <PatientProfileHeader
          patient={patient}
          isEditable={true}
          onEdit={() => {
            navigate(`/patient/${patientId}/edit`);
          }}
        />

        <TabContainer
          align="flex-start"
          justify="flex-start"
          fullHeight
          fullWidth
          padding="sm"
          direction="column"
        >
          <Tabs
            defaultActiveKey="medicalHistory"
            type="card"
            style={{ width: '100%' }}
            tabBarGutter={8}
            renderTabBar={() => (
              <Segmented
                block
                style={{ padding: 4, marginBottom: 12 }}
                options={[
                  {
                    value: 'medicalHistory',
                    label: (
                      <StyledTabButton>
                        Medical History
                      </StyledTabButton>
                    ),
                  },
                  {
                    value: 'availableDoctors',
                    label: (
                      <StyledTabButton>
                        Available Doctors{' '}
                        <Badge
                          count={availableDoctors.length}
                          style={{ fontWeight: 'bold' }}
                        />
                      </StyledTabButton>
                    ),
                  },
                ]}
                value={value}
                onChange={setValue}
                size="large"
              />
            )}
            activeKey={value}
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
                children: <AvailableDoctors patientId={patientId!} />,
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
`;

const StyledTabButton = styled.div`
  padding: 8px;
  font-weight: bold;
`;
