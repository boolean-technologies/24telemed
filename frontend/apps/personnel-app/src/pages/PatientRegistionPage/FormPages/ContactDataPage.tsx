import { Form, Input } from 'antd';

export function ContactDataPage() {
  return (
    <>
      <Form.Item label="Phone number" name="phone_number">
        <Input placeholder="Enter phone number" type="tel" />
      </Form.Item>
      <Form.Item label="Email address" name="email_address">
        <Input placeholder="Enter email address" />
      </Form.Item>
      <Form.Item label="Residential address" name="address">
        <Input.TextArea placeholder="Enter residential address" rows={6} />
      </Form.Item>
      <Form.Item label="Address City" name="city">
        <Input placeholder="Enter address city" />
      </Form.Item>
    </>
  );
}
