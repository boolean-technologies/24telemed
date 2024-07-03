import { Flex, Typography, Logo } from '@local/shared-components';
import { Form, Input, Button, Checkbox, Space } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import styled, { css } from 'styled-components';
import { BG } from '../../assets';
import { Link, useNavigate } from 'react-router-dom';
import { parseApiError, useLogin } from '@local/api-generated';
import { Path } from '../../constants';
import { useState } from 'react';
import { Alert } from 'antd';

type FormFieldType = {
  username: string;
  password: string;
};

export function LoginPage() {
  const login = useLogin();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: FormFieldType) => {
    login.performLogin(values, () => {
      navigate(Path.home);
    });
  };

  const errorMessage = parseApiError(login?.error);

  return (
    <StyledRoot
      direction="column"
      gap="sm"
      fullHeight
      justify="center"
      align="flex-start"
    >
      <HeaderImage src={BG} alt="header-image" />
      <Flex
        direction="column"
        align="center"
        justify="center"
        padding="md"
        fullHeight
        fullWidth
        style={{ maxWidth: 860, margin: 'auto', zIndex: 1 }}
      >
        <Flex
          direction="column"
          smAlign="center"
          gap="xl"
          align="flex-start"
          fullWidth
        >
          <Logo size="xl" />
          <div>
            <Typography variant="bodyXl" weight="bold">
              Secure Login
            </Typography>
            <Typography>
              Enter your username & password to login to your account.
            </Typography>
          </div>
        </Flex>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ width: '100%' }}
        >
          <Flex direction="column">
            {errorMessage && (
              <Flex padding="sm" fullWidth>
                <Alert
                  message={errorMessage}
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
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
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
              <Button
                block
                type="submit"
                loading={login.isPending}
                color="primary"
              >
                Log in
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Flex>
      <Flex fullWidth padding="md" align="center" justify="center">
        <Typography variant="bodySm">
          Anambra State Telemed @{new Date().getFullYear()}
        </Typography>
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
  height: 100vh;
  width: 100vw;
`;
const HeaderImage = styled.img`
  width: 300px;
  height: 200px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
`;

const PasswordIconWrapper = styled.div`
  padding: 4px;
  cursor: pointer;
  svg {
    display: block;
    font-size: var(--adm-font-size-7);
  }
`;
