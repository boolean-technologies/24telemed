import { Typography } from '@local/shared-components';
import { DatePicker, Form, Input, Select } from 'antd';
import { Controller,} from 'react-hook-form';

interface BioDataPageProps {
  control: any;
  errors: any;
}

export function BioDataPage({ control, errors }: BioDataPageProps) {
  return (
    <>
      <Form.Item
        label="First name"
        name="first_name"
        rules={[{ required: true }]}
      >
        <Controller
          control={control}
          name="first_name"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              placeholder="Enter firstname"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          defaultValue=""
        />
        {errors.first_name && (
          <Typography variant="bodySm" color="error">
            {errors.first_name?.message}
          </Typography>
        )}
      </Form.Item>

      <Form.Item
        label="Last name"
        name="last_name"
        rules={[{ required: true }]}
      >
        <Controller
          control={control}
          name="last_name"
          render={({ field }) => (
            <Input {...field} placeholder="Enter lastname" />
          )}
        />
        {errors.last_name && (
          <Typography variant="bodySm" color="error">
            {errors.last_name?.message}
          </Typography>
        )}
      </Form.Item>
      <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              style={{ width: '100%' }}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
              ]}
              placeholder="Select gender"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.gender?.message && (
          <Typography variant="bodySm" color="error">
            {errors.gender?.message}
          </Typography>
        )}
      </Form.Item>
      <Form.Item label="Date of Birth" name="date_of_birth" style={{ flex: 1 }} rules={[{ required: true }]}>
        <Controller
          control={control}
          name="date_of_birth"
          render={({ field }) => (
            <DatePicker
              {...field}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder="Select date of birth"
            />
          )}
        />
        {errors.date_of_birth?.message && (
          <Typography variant="bodySm" color="error">
            {errors.date_of_birth?.message}
          </Typography>
        )}
      </Form.Item>
    </>
  );
}
