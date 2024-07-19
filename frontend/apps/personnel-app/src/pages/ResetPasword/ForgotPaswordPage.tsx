import { Flex, Logo } from '@local/shared-components';
import { Form, Input, Button, Space } from 'antd-mobile';
import { Typography } from '@local/shared-components';

import { parseApiError, useForgotPassword } from '@local/api-generated';
import { Alert, Result } from 'antd';
import { Link } from 'react-router-dom';
import { Path } from '../../constants';
import { PersonnelAuthLayout } from '../../components/PageLayout';
import { OTPView } from './OTPView';

type FormFieldType = {
  identifier: string;
};
export function ForgotPaswordPage() {
  const forgotPassword = useForgotPassword();
  const isPhone = (value: string) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(value);
  };

  const onFinish = (values: FormFieldType) =>
    forgotPassword.mutate(values.identifier);
console.log(isPhone("09068874821"))

  return (
    <PersonnelAuthLayout
      name={forgotPassword.isSuccess ? null : 'Forgot Password'}
      description={
        forgotPassword.isSuccess
          ? null
          : 'Enter your email, username or phone number to reset your password.'
      }
    >
      {forgotPassword.isError && (
        <Flex padding="sm" fullWidth>
          <Alert
            message={
              parseApiError(forgotPassword.error) ||
              'An error occured, please try again'
            }
            type="error"
            showIcon
          />
        </Flex>
      )}

      {forgotPassword.isSuccess ? (
        <OTPView
        />
      ) : (
        <>
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
                  message:
                    'Please input your email or username or phone number!',
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
          </Flex>{' '}
        </>
      )}
    </PersonnelAuthLayout>
  );
}
