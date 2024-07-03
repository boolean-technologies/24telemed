import { Flex } from '@local/shared-components';
import { Form, Input, Button } from 'antd-mobile';

import { PersonnelAuthLayout } from '../../components/PageLayout';
import { useResetPassword } from '@local/api-generated';

type FormFieldType = {
  newPassword: string;
  confirmPassword: string;
};
export function PasswordSetingsPage() {
  const resetPassword = useResetPassword();
  const onFinish = (values: FormFieldType) => {
    resetPassword.mutate(values.newPassword);
  };
  return (
    <PersonnelAuthLayout
      name="Change Password"
      description="Enter your new password and confirm to change your password."
    >
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
            { min: 8, message: 'Password must be at least 8 characters long!' },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message:
                'Password must contain at least one letter and one number!',
            },
          ]}
        >
          <Input />
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
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Flex padding="sm">
            <Button block type="submit" color="primary" loading={resetPassword.isPending}>
              Change Password
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </PersonnelAuthLayout>
  );
}
