import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPatient } from '../../api/patient';
import {
  Flex,
  PageLoading,
  PatientProfileHeader,
  MedicalHistory,
} from '@local/shared-components';
import styled from 'styled-components';
import { Badge, Segmented, Tabs } from 'antd';
import AvailableDoctors from './AvailableDoctors';
import { usePersonnelCommunication } from '@local/websocket';

type PatientProfileProps = {
  patientId: string;
}

export function PatientProfile({ patientId }: PatientProfileProps) {
  const { data: patient, isPending } = useGetPatient(patientId);
  const navigate = useNavigate();
  const { availableDoctors } = usePersonnelCommunication();
  const [value, setValue] = useState<string>('medicalHistory');

  if (isPending) return <PageLoading />;

  if (!patient) return null;

  return (
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
  );
}

const TabContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
`;

const StyledTabButton = styled.div`
  padding: 8px;
  font-weight: bold;
`;
