import { Flex } from '@local/shared-components';
import { Form, Button } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
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
  isLoading,
}: FormWrapperProps<FormFieldType>) {
  const [form] = Form.useForm<FormFieldType>();

  return (
    <Form
      form={form}
      name={name}
      initialValues={initialValues as any}
      onFinish={onFinish}
      layout="vertical"
      style={{ height: '100%' }}
    >
      <Flex direction="column" gap="md" justify="space-between" fullHeight>
        <div>{children}</div>
        <Flex justify="flex-end">
          <SubmitButton form={form} loading={isLoading || false}>
            {submitLabel || 'Submit'}
          </SubmitButton>
        </Flex>
      </Flex>
    </Form>
  );
}

interface SubmitButtonProps {
  form: FormInstance;
  loading: boolean;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  form,
  children,
  loading,
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      style={{ width: '100%', fontWeight: 'bold' }}
      disabled={!submittable}
      loading={loading}
    >
      {children}
    </Button>
  );
};
