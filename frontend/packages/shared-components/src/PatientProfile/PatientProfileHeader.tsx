import { Patient } from '@local/api-generated';

import { Avatar, Button, Image, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Flex } from '../Flex';
import { Typography } from '../Typography';

type PatientProfileHeaderProps = {
  patient: Patient;
  onEdit?: () => void;
  inCall?: boolean;
  isEditable?: boolean;
};

export const PatientProfileHeader = ({
  patient,
  onEdit,
  inCall,
  isEditable,
}: PatientProfileHeaderProps) => {
  const patientName = [patient?.first_name, patient?.last_name]
    .filter(Boolean)
    .join(' ');
  const patientInitials = [patient?.first_name, patient?.last_name]
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join('.');
  return (
    <Flex
      fullWidth
      padding="xl"
      smPadding="lg"
      justify={inCall ? "center" : "space-between"}
      xsDirection="column"
      >
      <Flex
        direction={inCall ? 'column' : 'row'}
        gap="sm"
        align="center"
        xsDirection="column"
      >
        {patient?.photo ? (
          <Image
            width={110}
            height={110}
            src={patient.photo}
            fallback="https://via.placeholder.com/150"
            style={{ borderRadius: 8, minWidth: 110 }}
          />
        ) : (
          <Avatar
            size={110}
            shape="square"
            src={patient.photo || ''}
            icon={patientInitials}
          />
        )}

        <Flex direction="column" gap="xxs" align={inCall ? "center" : undefined}>
          <Flex direction="row" gap="xs">
            <Typography
              variant="bodyXl"
              weight="bold"
              align={inCall ? 'center' : 'left'}
              xsAlign="center"
            >
              {patientName}
            </Typography>
          </Flex>
          <Flex
            gap="xs"
            xsDirection="column"
          >
            <Typography>
              Gender: <strong>{patient.gender}</strong>
            </Typography>
            <span>•</span>
            <Typography>
              Age: <strong>{patient.age}yrs</strong>
            </Typography>
          </Flex>
          <Flex
            direction={inCall ? 'column' : 'row'}
            gap="xs"
            xsDirection="column"
          >
            <Typography>
              Patient ID: <strong>{patient.patient_id}</strong>
            </Typography>
          </Flex>
          <Flex
            direction={inCall ? 'column' : 'row'}
            gap="xs"
            xsDirection="column"
          >
            <Typography>
              Last visit date: <strong>{
                patient.last_seen
                  ? new Date(patient.last_seen).toLocaleDateString()
                  : 'N/A'
                }</strong>
            </Typography>
          </Flex>
        </Flex>
      </Flex>
      {isEditable ? (
        <Tooltip title="Modify patient record">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={onEdit}
          />
        </Tooltip>
      ) : null}
    </Flex>
  );
};
