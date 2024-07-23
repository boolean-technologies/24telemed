import { Form, Input, Button, Checkbox, Alert, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined,
  FileMarkdownFilled,
  PhoneFilled
 } from '@ant-design/icons';
import { Flex, Typography, useLogin } from '@local/shared-components';
import { parseApiError } from '@local/api-generated';
import { Path } from '../../constants';
import { useState } from 'react';


type FormFieldType = {
  username: string;
  password: string;
};

export function LoginForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const login = useLogin();
  const navigate = useNavigate();

  const onFinish = (values: FormFieldType) => {
    login.performLogin(values, () => {
      navigate(Path.home);
    });
  };

  const errorMessage = parseApiError(login?.error);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      style={{ width: '100%', height: '100%' }}
    >
      <Typography weight="bold" variant="h3" marginBottom="md">
        Secure login
      </Typography>
      <Flex direction="column" justify="space-between" gap="xl" fullHeight>
        <Flex direction="column" gap="none">
          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              style={{ marginBottom: 16 }}
            />
          )}
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { type: 'string', message: 'The input is not a valid username!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link to="/forgot-password">Forgot password</Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', fontWeight: 'bold' }}
              loading={login.isPending}
            >
              Log in
            </Button>
          </Form.Item>
        </Flex>
        <Typography align="center">
          Don't have account? <Button type="link" onClick={showModal}>
            Contact Admin
          </Button>
        </Typography>
      </Flex>

      <Modal
        title="Admin Contact Information"
        
        onOk={handleOk}
        onCancel={handleCancel}
        open={isModalOpen}
        centered
      >
        <Flex direction="column" gap="md">

          <Flex direction="column" gap="none">
            <Typography weight="bold">Email</Typography>
            <Link to="mailto:coo@theboolean.tech">
              <Typography>
                coo@theboolean.tech
              
              </Typography>
            </Link>

            
              
          <Flex direction="column" gap="none">
            <Typography weight="bold">Phone</Typography>
            <Link to="tel:+2349094267360">
              <Typography>
              +2349094267360
              </Typography>
            </Link>
          </Flex>
          </Flex>
        </Flex>
      </Modal>
    </Form>
  );
}
