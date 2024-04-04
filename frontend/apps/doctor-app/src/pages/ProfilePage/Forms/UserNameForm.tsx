import { Alert, Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';
import { parseApiError, useUpdateUser } from '@local/api-generated';

type FormField = {
  username: string;
};

type Props = {
  userId: string;
  refetch: any;
  defaultUsername: string;
};

export function UserNameForm({ userId, refetch, defaultUsername }: Props) {
  const { mutate, isPending, error, isError, isSuccess } = useUpdateUser();

  const onFinish = (values: FormField) => {
    mutate(
      {
        id: userId,
        data: values as any,
      },

      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <FormWrapper<FormField>
      name="nameForm"
      onFinish={onFinish}
      initialValues={{ username: '' }}
      isLoading={isPending}
    >
      {isError && (
        <Alert
          message="Error"
          description={parseApiError(error)}
          type="error"
          style={{
            marginBottom: 16,
          }}
        />
      )}
      {isSuccess && (
        <Alert
          message="Success"
          description="username updated"
          type="success"
          style={{
            marginBottom: 16,
          }}
        />
      )}

      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input defaultValue={defaultUsername} />
      </Form.Item>
    </FormWrapper>
  );
}
