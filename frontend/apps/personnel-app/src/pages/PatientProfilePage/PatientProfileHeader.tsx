import { Patient } from '@local/api-generated';
import { Flex, IonIcon, Typography } from '@local/shared-components';
import { Button, Image, Tag, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';

type Props = {
  patient: Patient;
};

const PatientProfileHeader = ({ patient }: Props) => {
  const patientName = `${patient.first_name} ${patient.last_name}`;
  return (
    <Flex fullWidth padding="xl" justify="space-between">
      <Flex direction="row" gap="sm" align="center">
        <Image
          width={100}
          height={100}
          src={patient.photo || ''}
          fallback="https://via.placeholder.com/150"
          style={{ borderRadius: 8 }}
        />
        <Flex direction="column" gap="xs">
          <Flex direction="row" gap="xs">
            <Typography variant="bodyXl" weight="bold">
              {patientName} ({patient.age}yrs) ({patient.gender.charAt(0)})
            </Typography>
          </Flex>
          <Flex direction="row" gap="xs">
            <Tag color="orange">
              Patient ID: <strong>{patient.phone_number}</strong>
            </Tag>
            <Typography variant="bodyMd">
              Phone number: {patient.phone_number}
            </Typography>
          </Flex>
          <Flex direction="row" gap="xs">
            <Typography variant="bodyMd">Last visit date:</Typography>
            <Tag>
              <IonIcon name="time" outlined /> 2 days ago
            </Tag>
          </Flex>
        </Flex>
      </Flex>
      <Tooltip title="Modify patient record">
        <Button type="primary" shape="circle" icon={<EditOutlined />} />
      </Tooltip>
    </Flex>
  );
};

export default PatientProfileHeader;
