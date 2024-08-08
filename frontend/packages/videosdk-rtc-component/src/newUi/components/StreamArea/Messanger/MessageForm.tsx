import { Button, Form, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Flex } from '@local/shared-components';
import { usePubSub } from '@videosdk.live/react-sdk';
import styled from 'styled-components';
import { useRef } from 'react';

type FormType = {
  message: string;
};

export function MessageForm() {
  const [form] = Form.useForm();
  const { publish } = usePubSub('CHAT');

  const onFinish = (data: FormType) => {
    publish(data.message, { persist: true });
    form.resetFields();
  };

  return (
    <StyledRoot>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ width: '100%' }}
      >
        <Flex fullWidth flex={1} align="center" padding="sm">
          <Form.Item name="message" style={{ width: '100%', marginBottom: 0 }}>
            <StyledTextArea
              placeholder="Type a message..."
              onPressEnter={form.submit}
              rows={1}
              autoFocus
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              size="middle"
            />
          </Form.Item>
        </Flex>
      </Form>
    </StyledRoot>
  );
}

const StyledRoot = styled.div`
  background: rgba(0, 0, 0, 0.75);
`;

const StyledTextArea = styled(Input.TextArea)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.palette.primary1.main};
  color: ${({ theme }) => theme.palette.common.white};
  padding: 8px 12px;
  border-radius: 4px;
  :focus,
  :hover {
    background-color: transparent;
    border-color: ${({ theme }) => theme.palette.primary1.lighter};
  }

  ::placeholder {
    color: ${({ theme }) => theme.palette.primary1.lighter};
  }
  resize: none !important;
`;