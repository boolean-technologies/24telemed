import { Alert, Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';
import { useUpdateUser } from '@local/api-generated';

type FormField = {
  location: string;
};

type Props = {
  userId: string;
  refetch: any;
  initialLocation: string;
};

export function LocationForm({
  userId,
  refetch,
  initialLocation,
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
        },
      }
    );
    
  };

  return (
    <FormWrapper<FormField>
      name="nameForm"
      onFinish={onFinish}
      initialValues={{ location: initialLocation }}
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
          description="Location updated"
          type="success"
          style={{ marginBottom: 16 }}
        />
      )}

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: 'Please input your location!' }]}
      >
        <Input />
      </Form.Item>
    </FormWrapper>
  );
}
