import {
  Flex,
  MedicalEncounterHistory,
  MedicalHistory,
  PatientProfileHeader,
  addAlpha,
} from '@local/shared-components';
import styled from 'styled-components';
import { useGetPatient } from '../../../hooks/patients';
import { useCallContext } from '../../../context/AppContext';
import { Tabs } from 'antd';
import { useGetUserMedicalEncounters } from '../../../api/encounter';
import { useState } from 'react';


export function PatientProfile() {
  const { patientId } = useCallContext();
  const { data: patient } = useGetPatient(patientId);
  const [pagination, setPagination] = useState({ page: 1, size: 5 });
  const { data: medicalEncounter, isLoading } = useGetUserMedicalEncounters({
    patient: patientId,
    page: pagination.page,
    size: pagination.size,
  });

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
          padding="sm"
          flex={1}
          direction="column"
        >
          <Tabs
            tabPosition="top"
            items={[
              {
                key: '1',
                label: 'Overview',
                children: <MedicalHistory patient={patient} />,
              },
              ...(medicalEncounter?.count
                ? [
                    {
                      key: '2',
                      label: 'Medical Encounters',
                      children: (
                        <MedicalEncounterHistory
                          total={medicalEncounter?.count}
                          encounters={medicalEncounter?.results ?? []}
                          pageSize={pagination.size}
                          onPaginationChange={(page, size) =>
                            setPagination({ page, size })
                          }
                          isLoading={isLoading}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </TabContainer>
      </StyledContainer>
    </StyledRoot>
  );
}

const TabContainer = styled(Flex)`
  background-color: ${({ theme }) => addAlpha(theme.palette.common.black, 0.3)};
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