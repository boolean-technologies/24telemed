import React from 'react';
import { AuthLayout } from '../../components/AuthLayout';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { parseApiError, useForgotPassword } from '@local/api-generated';
import { Flex, Typography } from '@local/shared-components';

type FormFieldType = {
  identifier: string;
};
export function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  return (
    <AuthLayout>
      <Form
        name="forgot-password"
        initialValues={{ remember: true }}
        autoComplete="off"
        style={{ width: '100%', height: '100%' }}
        onFinish={(values: FormFieldType) => {
          forgotPassword.mutate(values.identifier);
        }}
      >
        <Typography weight="bold" variant="h3" marginBottom="md">
          Forgot password
        </Typography>
        <Typography variant="bodyMd" marginBottom="xl">
          Enter your email or username to OTP
        </Typography>
        {
          forgotPassword.error && (
            <Alert
              message={parseApiError(forgotPassword.error)}
              type="error"
              style={{ marginBottom: 16 }}
            />
          )
        }
        <Flex direction="column" gap="xl" fullHeight>
          <Form.Item
            name="identifier"
            rules={[
              {
                required: true,
                message: 'Please input your email or username!',
              },
              {
                type: 'string',
                message: 'The input is not a valid email or username!',
              },
            ]}
          >
            <Input placeholder="Email or username" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={forgotPassword.isPending}
            >
              Send OTP
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </AuthLayout>
  );
}
