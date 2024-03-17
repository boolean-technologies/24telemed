import { Button, Form, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Flex } from '@local/shared-components';
import { usePubSub } from '@videosdk.live/react-sdk';
import styled from 'styled-components';

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
  background: rgba(0, 0, 0, 0.1);
`;

const StyledTextArea = styled(Input.TextArea)`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.palette.common.white};
  :focus,
  :hover {
    background-color: transparent;
  }
  ::placeholder {
    color: ${({ theme }) => theme.palette.primary1.lighter};
  }
  resize: none !important;
`;
