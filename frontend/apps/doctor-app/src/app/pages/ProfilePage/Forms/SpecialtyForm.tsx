import { Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';

type FormField = {
  specialty: string;
};

export function SpecialtyForm() {
  const onFinish = (values: FormField) => {
    console.log('Received values of form: ', values);
  };

  return (
    <FormWrapper<FormField>
      name="nameForm"
      onFinish={onFinish}
      initialValues={{ specialty: '' }}
    >
      <Form.Item
        name="specialty"
        label="Specialty"
        rules={[{ required: true, message: 'Please input your specialty!' }]}
      >
        <Input.TextArea />
      </Form.Item>
    </FormWrapper>
  );
}
