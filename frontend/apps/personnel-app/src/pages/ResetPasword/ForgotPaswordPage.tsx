import { Flex, Logo } from '@local/shared-components';
import { Form, Input, Button, Space } from 'antd-mobile';
import { Typography } from '@local/shared-components';
import { BG } from '../../assets';
import styled from 'styled-components';
import { useForgotPassword } from '@local/api-generated';
import { Alert } from 'antd';
import { Link } from 'react-router-dom';
import { Path } from '../../constants';

type FormFieldType = {
  identifier: string;
};
export function ForgotPaswordPage() {
  const forgotPassword = useForgotPassword();
  const isPhone = (value: string) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(value);
  };

  const onFinish = (values: FormFieldType) => {
    forgotPassword.mutate(values.identifier, {
      onSuccess: () => {
        if (isPhone(values.identifier)) {
          // TODO: navigate to phone verification page

          console.log('navigate to phone verification page');
        }
      },
    });
  };

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
          <Logo
            size="xl"
            style={{
              position: 'absolute',
              top: '0',
              zIndex: 0,
            }}
          />
          {forgotPassword.isError && (
            <Flex padding="sm" fullWidth>
              <Alert
                message={
                  'No account found with that email or username or phone number'
                }
                type="error"
                showIcon
              />
            </Flex>
          )}

          {forgotPassword.isSuccess && (
            <Flex padding="sm" fullWidth>
              <Alert
                message={
                  'A password reset link has been sent to your email address'
                }
                type="success"
                showIcon
              />
            </Flex>
          )}
          <div>
            <Typography variant="bodyXl" weight="bold">
              Forgot Password
            </Typography>
            <Typography>
              Enter your email or username or phone number to reset your
              password.
            </Typography>
          </div>
        </Flex>

        <Form
          name="forgotPassword"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          style={{ width: '100%' }}
        >
          <Form.Item
            name="identifier"
            rules={[
              {
                required: true,
                message: 'Please input your email or username or phone number!',
              },
            ]}
          >
            <Input placeholder="Email, Username or Phone" />
          </Form.Item>
          <Form.Item style={{ width: '100%' }}>
            
              <Button
                block
                type="submit"
                loading={forgotPassword.isPending}
                color="primary"
              >
                Reset Password
              </Button>
            
          </Form.Item>
        </Form>
        <Space />
        <Flex padding="sm">
          <Link to={Path.login}>
            <Typography variant="bodySm">Back to login</Typography>
          </Link>
        </Flex>
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
  height: 100vh;
`;

const HeaderImage = styled.img`
  width: 300px;
  height: 200px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
`;

