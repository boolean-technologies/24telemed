import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { Flex, Typography } from '@local/shared-components';
import { parseApiError, useLogin } from '@local/api-generated';
import { Path } from '../../constants';

type FormFieldType = {
  username: string;
  password: string;
};

export function LoginForm() {
  const login = useLogin();
  const navigate = useNavigate();

  const onFinish = (values: FormFieldType) => {
    login.performLogin(values, () => {
      navigate(Path.home);
    });
  };

  const errorMessage = parseApiError(login?.error);

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
              { type: 'email', message: 'The input is not a valid username!' },
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
          Don't have account? <Link to="/register">Contact our admin</Link>
        </Typography>
      </Flex>
    </Form>
  );
}
