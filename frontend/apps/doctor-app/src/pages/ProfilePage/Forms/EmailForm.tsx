import { Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';

type FormField = {
  email: string;
};

export function EmailForm() {
  const onFinish = (values: FormField) => {
    console.log('Received values of form: ', values);
  };

  return (
    <FormWrapper<FormField>
      name="nameForm"
      onFinish={onFinish}
      initialValues={{ email: '' }}
    >
      <Form.Item
        name="email"
        label="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input type="email" />
      </Form.Item>
    </FormWrapper>
  );
}
