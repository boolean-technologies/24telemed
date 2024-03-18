import { Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';

type FormField = {
  description: string;
};

export function DescriptionForm() {
  const onFinish = (values: FormField) => {
    console.log('Received values of form: ', values);
  };

  return (
    <FormWrapper<FormField>
      name="nameForm"
      onFinish={onFinish}
      initialValues={{ description: '' }}
    >
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
