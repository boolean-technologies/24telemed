import { useChangePassword } from '@local/api-generated';
import { Button, Form, Input } from 'antd';

type FormField = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export function PasswordForm() {
  const { isPending, mutate } = useChangePassword();
  const onFinish = (values: FormField) => {
    mutate(
      {
        current_password: values.oldPassword,
        new_password: values.newPassword,
      },
      {
        onSuccess: () => {
          console.log('Password changed');
        },

        onError: (error) => {
          console.log('Password not changed', error);
        },
      }
    );
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="oldPassword"
        label="Old Password"
        rules={[{ required: true, message: 'Please input your old password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[{ required: true, message: 'Please input your new password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirmNewPassword"
        label="Confirm New Password"
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
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%', fontWeight: 'bold' }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
