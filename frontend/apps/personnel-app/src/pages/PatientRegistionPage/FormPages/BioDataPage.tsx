import { Flex } from '@local/shared-components';
import { DatePicker, Form, Input, Select } from 'antd';

export function BioDataPage() {
  return (
    <>
      <Form.Item
        label="First name"
        name="first_name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter firstname" />
      </Form.Item>
      <Form.Item
        label="Last name"
        name="last_name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter lastname" />
      </Form.Item>
      <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
        <Select
          style={{ width: '100%' }}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
          ]}
          placeholder="Select gender"
        />
      </Form.Item>
      <Form.Item label="Date of Birth" name="date_of_birth" style={{ flex: 1 }}>
        <DatePicker
          // defaultValue="2019-09-03"
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Flex fullWidth>
        <Form.Item
          label="Identification Type"
          name="identification_type"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Select
            style={{ width: '100%' }}
            options={[
              { value: 'VOTERS-CARD', label: "Voter's Card" },
              { value: 'NIN', label: 'National Identification Number' },
              { value: 'PENSION', label: 'Pension Identification Number' },
              { value: 'BVN', label: 'Bank Verification Number' },
              { value: 'TIN', label: 'Tax Identification Number' },
              { value: 'NONE', label: 'No identificaiton' },
            ]}
            placeholder="Select identification type"
          />
        </Form.Item>
        <Form.Item
          label="Identification number"
          name="identification_number"
          style={{ flex: 1 }}
        >
          <Input placeholder="Enter ID number" />
        </Form.Item>
      </Flex>
    </>
  );
}
