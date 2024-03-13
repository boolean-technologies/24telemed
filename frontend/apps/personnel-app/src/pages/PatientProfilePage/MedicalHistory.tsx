import { Patient } from '@local/api-generated';
import { Flex, Typography } from '@local/shared-components';
import { Card, Collapse, Divider, CollapseProps } from 'antd';
import styled from 'styled-components';

 type Props = {
  patient: Patient;
};

type PatientValueProps = {
  label: string;
  value: string | number | undefined;
};

const MedicalHistory = ({ patient }: Props) => {
  const { immunization_record, family_medical_history } = patient;
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <Typography variant="bodyMd">Immunization Record</Typography>,
      children: <Typography variant="bodySm">{immunization_record}</Typography>,
    },
    {
      key: '2',
      label: <Typography variant="bodyMd">Family Medical History</Typography>,
      children: (
        <Typography variant="bodySm">{family_medical_history}</Typography>
      ),
    },
  ];
  return (
    <StyledCard>
      <Flex direction="row" gap="md" justify="space-between">
        <PatientValue label="Weight" value={`${patient.weight} kg`} />
        <PatientValue label="Height" value={`${patient.height} cm`} />
        <PatientValue label="Blood Type" value={patient.blood_type} />
      </Flex>
      <Divider />
      <Flex direction="row" gap="xs" justify="space-between">
        <Flex direction="column" gap="sm">
          <PatientValue
            label="Medical History"
            value={patient.medical_history}
          />

          <PatientValue label="Allergies" value={patient.allergies} />
        </Flex>
        <Flex direction="column" gap="sm">
          <PatientValue
            label="Current Medications"
            value={patient.current_medications}
          />
          <PatientValue
            label="Chronic Conditions"
            value={patient.chronic_conditions}
          />
        </Flex>
      </Flex>
      <Divider />
      <Collapse items={items} />
    </StyledCard>
  );
};

export default MedicalHistory;

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.palette.neutral.main};
`;

const PatientValue = ({ label, value }: PatientValueProps) => (
  <Flex direction="column" gap="none">
    <Typography variant="bodySm" weight="bold">
      {label}:
    </Typography>
    <Typography variant="bodySm">{value}</Typography>
  </Flex>
);
