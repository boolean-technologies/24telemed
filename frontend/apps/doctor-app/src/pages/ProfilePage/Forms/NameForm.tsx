import { Alert, Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';
import { useUpdateUser } from '@local/api-generated';

type FormField = {
  first_name: string;
  last_name: string;
};

type Props = {
  userId: string;
  refetch: any;
  initialFirstName: string;
  initialLastName: string;
  onClose: () => void;
};
export function NameForm({
  userId,
  refetch,
  initialFirstName,
  initialLastName,
  onClose,
}: Props) {
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
      initialValues={{
        first_name: initialFirstName,
        last_name: initialLastName,
      }}
      isLoading={isPending}
    >
      {isError && (
        <Alert
          message="Error"
          description={error?.message}
          type="error"
          style={{
            marginBottom: 16,
          }}
        />
      )}

      {isSuccess && (
        <Alert
          message="Success"
          description="Name updated"
          type="success"
          style={{
            marginBottom: 16,
          }}
        />
      )}
      <Form.Item
        name="first_name"
        label="First name"
        rules={[{ required: true, message: 'Please input your firstname!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="last_name"
        label="Last name"
        rules={[{ required: true, message: 'Please input your lastname!' }]}
      >
        <Input />
      </Form.Item>
    </FormWrapper>
  );
}
