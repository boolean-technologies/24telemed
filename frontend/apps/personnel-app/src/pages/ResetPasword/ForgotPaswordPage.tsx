import { Flex, Logo } from '@local/shared-components';
import { Form, Input, Button, Space } from 'antd-mobile';
import { Typography } from '@local/shared-components';
import { BG } from '../../assets';
import styled from 'styled-components';
import { useForgotPassword } from '@local/api-generated';
import { Alert } from 'antd';
import { Link } from 'react-router-dom';
import { Path } from '../../constants';
import { PersonnelAuthLayout } from '../../components/PageLayout';

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
    <PersonnelAuthLayout
      name="Forgot Password"
      description="Enter your email, username or phone number to reset your password."
    >
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
    </PersonnelAuthLayout>
  );
}
