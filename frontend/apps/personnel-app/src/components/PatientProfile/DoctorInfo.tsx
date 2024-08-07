import { Flex, IonIcon, Typography } from '@local/shared-components';
import { Button, Image, Modal } from 'antd-mobile';
import styled from 'styled-components';
import { useGetDoctor } from '../../api/doctor';
import { Avatar, Form, Input, Select, Skeleton } from 'antd';
import { usePersonnelCommunication } from '@local/websocket';
import { useState } from 'react';

type DoctorInfoComponentProps = {
  id: string;
  patientId: string;
};

const DoctorInfoComponent = ({ id, patientId }: DoctorInfoComponentProps) => {
  const { callDoctor } = usePersonnelCommunication();
  const { data, isPending } = useGetDoctor(id);
  const [shoCallModal, setShowCallModal] = useState(false);

  const handleCallDoctor = ({ note = "", priority = 1 }: { note: string; priority: number }) => {
    callDoctor({ note, priority, doctorId: id, patientId });
    setShowCallModal(false);
  };

  if (isPending) {
    return <Skeleton avatar paragraph={{ rows: 1 }} />;
  }
  return (
    <>
      <DoctorInfo direction="row" justify="space-between">
        <Flex>
          <Avatar src={data?.photo} size={60} icon={<IonIcon name="person" outlined />} />
          <Flex direction="column" gap="none">
            <Typography variant="bodyMd">
              {' '}
              {data?.first_name} {data?.last_name}{' '}
            </Typography>
            <Typography variant="bodyXs"> {data?.specialty || '-'} </Typography>
          </Flex>
        </Flex>
        <Flex direction="row" gap="sm">
          <Button color="primary" onClick={() => setShowCallModal(true)}>
            Call Doctor
          </Button>
        </Flex>
      </DoctorInfo>
      <Modal
        visible={shoCallModal}
        title="Call Doctor"
        content={
          <Form
            name="callDoctor"
            layout="vertical"
            onFinish={handleCallDoctor}
            initialValues={{ priority: 1 } as any}
          >
            <Form.Item
              label="Priority"
              name="priority"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 1, label: 'Low' },
                  { value: 2, label: 'Medium' },
                  { value: 3, label: 'High' },
                  { value: 4, label: 'Critical' },
                ]}
                placeholder="Select priority"
              />
            </Form.Item>
            <Form.Item label="Reasons" name="note">
              <Input.TextArea placeholder="Reason for this call" />
            </Form.Item>
            <Form.Item>
              <Button
                color="primary"
                type="submit"
                style={{ width: '100%', height: 50 }}
              >
                Continue Call
              </Button>
            </Form.Item>
          </Form>
        }
        actions={[
          {
            key: 'cancel',
            text: 'Cancel Call',
            onClick: () => setShowCallModal(false),
          },
        ]}
      />
    </>
  );
};

export default DoctorInfoComponent;

const DoctorInfo = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
`;

const StyledIconWrapper = styled(Flex)`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  border: ${({ theme }) => theme.border.primary.main};
  background: ${({ theme }) => theme.palette.primary1.main};
  overflow: hidden;
`;
