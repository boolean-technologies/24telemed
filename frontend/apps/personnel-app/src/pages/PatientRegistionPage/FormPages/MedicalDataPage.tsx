import { Flex } from '@local/shared-components';
import { Form, Input } from 'antd';

export function MedicalDataPage() {
  return (
    <>
      <Form.Item label="Medical history" name="medical_history">
        <Input.TextArea
          placeholder="Write patient's medical data here"
          rows={6}
        />
      </Form.Item>
      <Form.Item label="Allergies" name="allergies">
        <Input.TextArea placeholder="Write patient's allergies here" rows={6} />
      </Form.Item>
      <Form.Item label="Chronic Conditions" name="chronic_conditions">
        <Input.TextArea placeholder="Write patient's condition here" rows={6} />
      </Form.Item>
      <Flex fullWidth>
        <Form.Item
          label="Blood Type"
          name="blood_type"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Enter blood type" />
        </Form.Item>
        <Form.Item
          label="Genotype"
          name="genetype"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Enter Genotype" />
        </Form.Item>
      </Flex>
      <Flex fullWidth>
        <Form.Item
          label="Weight (kg)"
          name="weight"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Enter weight" type="number" />
        </Form.Item>
        <Form.Item
          label="Height"
          name="height"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Enter height" type="number" />
        </Form.Item>
      </Flex>
      <Form.Item label="Immunization Records" name="immunization_records">
        <Input.TextArea placeholder="Write patient's immunization records here" rows={6} />
      </Form.Item>
      <Form.Item label="Family Medical History" name="family_medical_history">
        <Input.TextArea placeholder="Write patient's family medical history here" rows={6} />
      </Form.Item>
    </>
  );
}
