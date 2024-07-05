import { Flex } from '@local/shared-components';
import { Form, Input, Button } from 'antd-mobile';

import { PersonnelAuthLayout } from '../../components/PageLayout';
import { parseApiError, useResetPassword } from '@local/api-generated';
import { useState } from 'react';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
import { Alert } from 'antd';
import { ResetSuccesss } from './ResetSuccesss';

type FormFieldType = {
  newPassword: string;
  confirmPassword: string;
};
export function PasswordSetingsPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const resetPassword = useResetPassword();
  const onFinish = (values: FormFieldType) =>
    resetPassword.mutate(values.newPassword);

  return (
    <PersonnelAuthLayout
      name={resetPassword.isSuccess ? null : 'Change Password'}
      description={
        resetPassword.isSuccess ? null : 'Please enter your new password'
      }
    >
      {resetPassword.isError && (
        <Flex padding="sm" fullWidth>
          <Alert
            message={parseApiError(resetPassword.error)}
            type="error"
            style={{ width: '100%' }}
          />
        </Flex>
      )}

      {resetPassword.isSuccess ? (
        <ResetSuccesss />
      ) : (
        <Form
          name="password"
          onFinish={onFinish}
          style={{ width: '100%', marginTop: '2rem' }}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="New Password"
            name="newPassword"
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
            extra={
              <PasswordIconWrapper
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOutline /> : <EyeInvisibleOutline />}
              </PasswordIconWrapper>
            }
          >
            <Input type={passwordVisible ? 'text' : 'password'} />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
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
            extra={
              <PasswordIconWrapper
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? (
                  <EyeOutline />
                ) : (
                  <EyeInvisibleOutline />
                )}
              </PasswordIconWrapper>
            }
          >
            <Input type={confirmPasswordVisible ? 'text' : 'password'} />
          </Form.Item>
          <Form.Item>
            <Flex padding="sm">
              <Button
                block
                type="submit"
                color="primary"
                loading={resetPassword.isPending}
              >
                Change Password
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      )}
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
