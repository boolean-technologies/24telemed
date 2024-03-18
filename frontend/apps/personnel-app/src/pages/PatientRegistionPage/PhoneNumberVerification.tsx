import { Flex, Typography } from '@local/shared-components';
import { Button, Drawer, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

// TODO: Check with client if this phone number verification is necessary
export function PhoneNumberVerification() {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const onFinish = () => {
    message.success('Submit success!');
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  return (
    <Drawer
      title={
        <Typography variant="h5" align="center">
          Verify Patient's phone number
        </Typography>
      }
      placement="bottom"
      key="register"
      open
      closable={false}
      styles={{ mask: { backdropFilter: 'blur(2px)' } }}
    >
      <Flex fullWidth direction="column">
        <Typography variant="bodyLg">
          Ensure the patient is presently with his/her mobile device to receive
          the OTP number.
        </Typography>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[
              {
                required: true,
                message: 'Please input the phone number!',
              },
              {
                pattern: new RegExp('^[0-9]*$'),
                message: 'Please input valid phone number!',
              },
              {
                max: 11,
                message: 'Phone number should be 11 digits',
              },
            ]}
          >
            <Input placeholder="080 123 456 41" />
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Flex fullWidth justify="space-between">
              <Button
                type="primary"
                htmlType="submit"
                style={{ flex: 1, fontWeight: 'bold' }}
              >
                Send OTP
              </Button>
              <Button
                htmlType="button"
                onClick={() => navigate(-1)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Flex>
    </Drawer>
  );
}
