import { Patient } from '@local/api-generated';
import { Card, Collapse, CollapseProps, Divider, Space } from 'antd';
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
  const itemStyle = { padding: 16, paddingLeft: 0, paddingRight: 0 }
  const items: CollapseProps['items'] = [
    {
      key: '5',
      label: (
        <Typography variant="bodyMd" weight="bold">
          Immunization Record
        </Typography>
      ),
      children: (
        <Typography variant="bodySm">
          {patient?.immunization_record || '-'}
        </Typography>
      ),
      style: itemStyle
    },
    {
      key: '6',
      label: (
        <Typography variant="bodyMd" weight="bold">
          Family Medical History
        </Typography>
      ),
      children: (
        <Typography variant="bodySm">
          {patient?.family_medical_history || '-'}
        </Typography>
      ),
      style: itemStyle
    },
  ];
  return (
    <StyledCard>
      <Flex direction="column" gap="xs">
        <Flex direction="row" gap="md">
          <PatientValue label="Weight" value={`${patient.weight || '-'} kg`} />
          <PatientValue label="Height" value={`${patient.height || '-'} cm`} />
          <PatientValue label="Blood Type" value={patient.blood_type || '-'} />
        </Flex>
        <Divider />
        <Space direction="vertical" size="large">
          <Flex direction="row" gap="md">
            <PatientValue
              label="Medical History"
              value={patient.medical_history}
            />
            <PatientValue
              label="Current Medication"
              value={patient.current_medications}
            />
          </Flex>
          <Flex direction="row" gap="md">
            <PatientValue
              label="Allergies"
              value={patient.allergies}
            />
            <PatientValue
              label="Chronic conditions"
              value={patient.chronic_conditions}
            />
          </Flex>
        </Space>
        <Divider style={{ marginBottom: 0 }} />
        <Collapse
          items={items}
          style={{ marginTop: 24, background: 'transparent' }}
          size="large"
          bordered={false}
        />
      </Flex>
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
