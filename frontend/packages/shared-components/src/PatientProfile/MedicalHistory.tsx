import { Patient } from '@local/api-generated';
import { Card, Collapse, CollapseProps } from 'antd';
import styled from 'styled-components';
import { Typography } from '../Typography';
import { Flex } from '../Flex';

type MedicalHistoryProps = {
  patient: Patient;
};

type PatientValueProps = {
  label: string;
  value: string | number | undefined;
};

export const MedicalHistory = ({ patient }: MedicalHistoryProps) => {
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <Typography variant="bodyMd" weight="bold">Medical History</Typography>,
      children: <Typography variant="bodySm">{patient?.medical_history || '-'}</Typography>,
    },
    {
      key: '2',
      label: <Typography variant="bodyMd" weight="bold">Current Medication</Typography>,
      children: <Typography variant="bodySm">{patient?.current_medications || '-'}</Typography>,
    },
    {
      key: '3',
      label: <Typography variant="bodyMd" weight="bold">Allergies</Typography>,
      children: <Typography variant="bodySm">{patient?.allergies || '-'}</Typography>,
    },
    {
      key: '4',
      label: <Typography variant="bodyMd" weight="bold">Chronic Conditions</Typography>,
      children: <Typography variant="bodySm">{patient?.chronic_conditions || '-'}</Typography>,
    },
    {
      key: '5',
      label: <Typography variant="bodyMd" weight="bold">Immunization Record</Typography>,
      children: <Typography variant="bodySm">{patient?.immunization_record || '-'}</Typography>,
    },
    {
      key: '6',
      label: <Typography variant="bodyMd" weight="bold">Family Medical History</Typography>,
      children: (
        <Typography variant="bodySm">{patient?.family_medical_history || '-'}</Typography>
      ),
    },
  ];
  return (
    <StyledCard>
      <Flex direction="row" gap="md">
        <PatientValue label="Weight" value={`${patient.weight || "??"} kg`} />
        <PatientValue label="Height" value={`${patient.height || "??"} cm`} />
        <PatientValue label="Blood Type" value={patient.blood_type || "??"} />
      </Flex>
      {/* <Divider /> */}
      <Collapse items={items} style={{ marginTop: 24 }} defaultActiveKey="1" />
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.palette.neutral.main};
  width: 100%;
`;

const PatientValue = ({ label, value }: PatientValueProps) => (
  <Flex direction="column" gap="none" fullWidth>
    <Typography weight="bold">{label}:</Typography>
    <Typography>{value || '-'}</Typography>
  </Flex>
);
