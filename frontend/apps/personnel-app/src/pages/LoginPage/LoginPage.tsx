import { Flex, Typography, usePersonnelLogin } from '@local/shared-components';
import { Form, Input, Button, Checkbox, Space } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import styled from 'styled-components';

import { Link, useNavigate } from 'react-router-dom';
import { parseApiError } from '@local/api-generated';
import { Path } from '../../constants';
import { useState } from 'react';
import { Alert } from 'antd'
import { PersonnelAuthLayout } from '../../components/PageLayout';


type FormFieldType = {
  username: string;
  password: string;
};

export function LoginPage() {
  const login = usePersonnelLogin();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: FormFieldType) => {
    login.performLogin(values, () => {
      navigate(Path.home);
    });
  };

  const errorMessage = parseApiError(login?.error);

  return (
    <PersonnelAuthLayout
      sideImage
    >
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ width: '100%' }}
    >
      <Typography weight="bold" variant="h3" marginBottom="md">
        Secure login
      </Typography>
      <Flex direction="column">
        {errorMessage && (
          <Flex padding="sm" fullWidth>
            <Alert
              message={"Invalid username or password"}
              type="error"
              style={{ width: '100%' }}
            />
          </Flex>
        )}
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input your username!' },
            {
              type: 'string',
              message: 'The input is not a valid username!',
            },
          ]}
        >
          <Input type="text" placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          extra={
            <PasswordIconWrapper>
              {!visible ? (
                <EyeInvisibleOutline onClick={() => setVisible(true)} />
              ) : (
                <EyeOutline onClick={() => setVisible(false)} />
              )}
            </PasswordIconWrapper>
          }
        >
          <Input
            type={visible ? 'text' : 'password'}
            placeholder="Enter password"
          />
        </Form.Item>
        <Flex justify="space-between" padding="sm">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>
              <Typography variant="bodySm">Remember me</Typography>
            </Checkbox>
          </Form.Item>

          <Link to={Path.forgotPassword}>
            <Typography variant="bodySm">Forgot password</Typography>
          </Link>
        </Flex>
        <Space />
        <Flex padding="sm">
          <Button block type="submit" loading={login.isPending} color="primary">
            Log in
          </Button>
        </Flex>
      </Flex>
    </Form>
    </PersonnelAuthLayout>
  );
}


const PasswordIconWrapper = styled.div`
  padding: 4px;
  cursor: pointer;
  svg {
    display: block;
    font-size: var(--adm-font-size-7);
  }
`;
