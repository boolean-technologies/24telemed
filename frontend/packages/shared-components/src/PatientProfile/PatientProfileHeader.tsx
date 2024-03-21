import { Patient } from '@local/api-generated';

import { Button, Image, Tag, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Flex } from '../Flex';
import { Typography } from '../Typography';
import { IonIcon } from '../IonIcon';

type PatientProfileHeaderProps = {
  patient: Patient;
  onEdit?: () => void;
};

export const PatientProfileHeader = ({
  patient,
  onEdit,
}: PatientProfileHeaderProps) => {
  const patientName = `${patient.first_name} ${patient.last_name}`;
  return (
    <Flex fullWidth padding="xl" smPadding="lg" justify="space-between" xsDirection="column">
      <Flex direction="row" gap="sm" align="center" xsDirection="column">
        <Image
          width={100}
          height={100}
          src={patient.photo || ''}
          fallback="https://via.placeholder.com/150"
          style={{ borderRadius: 8 }}
        />
        <Flex direction="column" gap="xs">
          <Flex direction="row" gap="xs">
            <Typography variant="bodyXl" weight="bold" xsAlign="center">
              {patientName} ({patient.age}yrs) ({patient.gender.charAt(0)})
            </Typography>
          </Flex>
          <Flex direction="row" gap="xs" xsDirection="column">
            <Tag color="orange">
              Patient ID: <strong>{patient.phone_number}</strong>
            </Tag>
            <Typography variant="bodyMd">
              Phone number: {patient.phone_number}
            </Typography>
          </Flex>
          <Flex direction="row" gap="xs" xsDirection="column">
            <Typography variant="bodyMd">Last visit date:</Typography>
            <Tag>
              <IonIcon name="time" outlined /> 2 days ago
            </Tag>
          </Flex>
        </Flex>
      </Flex>
      {onEdit ? (
        <Tooltip title="Modify patient record">
          <Button type="primary" shape="circle" icon={<EditOutlined />} />
        </Tooltip>
      ) : null}
    </Flex>
  );
};
