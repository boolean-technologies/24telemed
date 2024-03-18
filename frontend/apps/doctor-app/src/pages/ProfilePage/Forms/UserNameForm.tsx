import { Form, Input } from 'antd';
import { FormWrapper } from '../../../components/FormWrapper';

type FormField = {
  username: string;
};

export function UserNameForm() {
  const onFinish = (values: FormField) => {
    console.log('Received values of form: ', values);
  };

  return (
    <FormWrapper<FormField>
      name="nameForm"
      onFinish={onFinish}
      initialValues={{ username: '' }}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>
    </FormWrapper>
  );
}
