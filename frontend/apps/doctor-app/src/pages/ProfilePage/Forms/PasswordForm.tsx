import { Alert, Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';
import { useChangePassword } from '@local/api-generated';

type FormField = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

interface Props {
  onClose: () => void;
}

export function PasswordForm({ onClose }: Props) {
  const {
    mutate: changePassword,
    isError,
    isSuccess,
    isPending,
  } = useChangePassword();
  const onFinish = (values: FormField) => {
    changePassword(
      {
        current_password: values.oldPassword,
        new_password: values.newPassword,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            onClose();
          }, 1000);
        },
      }
    );
  };

  return (
    <FormWrapper<FormField>
      name="nameForm"
      onFinish={onFinish}
      isLoading={isPending}
    >
      {isError && (
        <Alert
          message="Error"
          description={
            'Password update failed, make sure you have entered the correct password'
          }
          type="error"
          style={{ marginBottom: 16 }}
        />
      )}
      {isSuccess && (
        <Alert
          message="Success"
          description="Password updated"
          type="success"
          style={{ marginBottom: 16 }}
        />
      )}

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
        rules={[
          { required: true, message: 'Please input your new password!' },
          { min: 8, message: 'Password must be at least 8 characters long!' },
          {
            pattern:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              'Password must contain at least one letter, one number and one special character!',
          },
        ]}
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
    </FormWrapper>
  );
}
