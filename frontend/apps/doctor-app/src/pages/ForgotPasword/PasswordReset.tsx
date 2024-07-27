import { Flex, Typography } from "@local/shared-components";
import { AuthLayout } from "../../components/AuthLayout";

import { Form, Input, Button, Checkbox, Alert, Result } from 'antd';
import { parseApiError, useResetPassword } from '@local/api-generated';
import { Link } from 'react-router-dom';
import { Path } from "../../constants";


type FormFieldType = {
  password: string;
  confirmPassword: string;
};

export function PasswordReset() {
  const resetPassword = useResetPassword();
  if (resetPassword.isSuccess) {
    return (
      <AuthLayout>
        <Result
          status="success"
          title="Password reset successful"
          subTitle="Your password has been reset successfully. You can now login using your new password."
          extra={[
            <Link to={Path.login} key="login">
              <Button type="primary">Login</Button>
            </Link>,
          ]}
        />
      </AuthLayout>
    );
  }
  return (
    <AuthLayout>
      <Form
        name="reset-password"
        initialValues={{ remember: true }}
        autoComplete="off"
        style={{ width: '100%', height: '100%' }}
        onFinish={(values: FormFieldType) => {
          resetPassword.mutate(values.password);
        }}
      >
        <Typography weight="bold" variant="h3" marginBottom="md">
          Reset password
        </Typography>
        <Typography variant="bodyMd" marginBottom="xl">
          Enter your new password.
        </Typography>
        {
          resetPassword.error && (
            <Alert
              message={"Unable to reset password, please try again"}
              type="error"
              style={{ marginBottom: 16 }}
            />
          )
        }
        <Flex direction="column" gap="xl" fullHeight>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              {
                min: 8,
                message: 'Password must be at least 8 characters long!',
              },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
                message:
                  'Password must contain at least one letter, one number, and special character!',
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              loading={resetPassword.isPending}
              disabled={resetPassword.isPending}
            >
              Reset password
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </AuthLayout>
  );
}

