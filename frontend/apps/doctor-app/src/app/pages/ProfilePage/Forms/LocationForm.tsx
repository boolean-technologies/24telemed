import { Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';

type FormField = {
  location: string;
};

export function LocationForm() {
  const onFinish = (values: FormField) => {
    console.log('Received values of form: ', values);
  };

  return (
    <FormWrapper<FormField>
      name="nameForm"
      onFinish={onFinish}
      initialValues={{ location: '' }}
    >
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
