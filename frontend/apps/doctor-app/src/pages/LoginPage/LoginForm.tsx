import { Form, Input, Button, Checkbox, Alert, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined,
 } from '@ant-design/icons';
import { Flex, Typography, useDoctorLogin } from '@local/shared-components';
import { parseApiError } from '@local/api-generated';
import { Path } from '../../constants';
import { useState } from 'react';


type FormFieldType = {
  username: string;
  password: string;
};
const admin_email = import.meta.env. VITE_ADMIN_CONTACT_EMAIL || "info@24telemed.org"
const admin_phone = import.meta.env. VITE_ADMIN_CONTACT_PHONE ||  "+2349112992719"
export function LoginForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const login = useDoctorLogin();
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
              message={"Invalid username or password"}
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
  title="Need an Account?"
  onOk={handleOk}
  onCancel={handleCancel}
  open={isModalOpen}
  centered
>
  <Flex direction="column" gap="md">
    <Typography>
      To set up your account, please contact the system administrator using the information below:
    </Typography>

    <Flex direction="column" gap="sm">
      <Flex direction="column" gap="none">
        <Typography >Email</Typography>
        <Link to={`mailto:${admin_email}`}>
          <Typography link>{admin_email}</Typography>
        </Link>
      </Flex>

      <Flex direction="column" gap="none">
        <Typography >Phone</Typography>
        <Link to={`tel:${admin_phone}`}>
          <Typography link>{admin_phone}</Typography>
        </Link>
      </Flex>
    </Flex>

    <Typography>
      The administrator will assist you in creating your account and providing necessary access.
    </Typography>
  </Flex>
</Modal>
    </Form>
  );
}
