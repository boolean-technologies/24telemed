import { Alert, Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';
import { useUpdateUser } from '@local/api-generated';

type FormField = {
  description: string;
};
type Props = {
  userId: string;
  refetch: any;
  initialDescription: string;
};

export function DescriptionForm( { userId, refetch, initialDescription, }: Props) {
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
      initialValues={{ description: initialDescription }}
      isLoading={isPending}
    >
      {isError && (
        <Alert
          message="Error"
          description={error?.message}
          type="error"
          style={{ marginBottom: 16 }}
        />
      )}
      {isSuccess && (
        <Alert
          message="Success"
          description="Description updated"
          type="success"
          style={{ marginBottom: 16 }}
        />
      )}

      <Form.Item
        name="description"
        label="description"
        rules={[{ required: true, message: 'Please input your description!' }]}
      >
        <Input.TextArea />
      </Form.Item>
    </FormWrapper>
  );
}
