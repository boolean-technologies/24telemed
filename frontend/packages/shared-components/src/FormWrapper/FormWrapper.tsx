import { Flex } from '@local/shared-components';
import { Form, Button } from 'antd';
import { ReactNode } from 'react';

type FormWrapperProps<FormFieldType> = {
  children: ReactNode;
  name: string;
  submitLabel?: string;
  onFinish: (values: FormFieldType) => void;
  initialValues?: FormFieldType;
  isLoading?: boolean;
};

export function FormWrapper<FormFieldType = undefined>({
  children,
  name,
  submitLabel,
  initialValues,
  onFinish,
  isLoading
}: FormWrapperProps<FormFieldType>) {
  const [form] = Form.useForm<FormFieldType>();

  return (
    <Form
      form={form}
      name={name}
      initialValues={initialValues as any}
      onFinish={onFinish}
      layout="vertical"
      style={{ height: "100%" }}
    >
      <Flex direction="column" gap="md" justify="space-between" fullHeight>
        <div>{children}</div>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%', fontWeight: 'bold' }}
          loading={isLoading}
        >
          {submitLabel || 'Save changes'}
        </Button>
      </Flex>
    </Form>
  );
}
