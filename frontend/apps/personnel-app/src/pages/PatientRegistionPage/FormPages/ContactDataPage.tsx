import { Typography } from '@local/shared-components';
import { Form, Input } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

export function ContactDataPage() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberOnly = value.replace(/[^0-9]/g, '');
    e.target.value = numberOnly;
  }
  return (
    <>
      <Form.Item
        label="Phone number"
        name="phone_number"
        rules={[{ required: true, message: 'Phone number is required' }]}
      >
        <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Enter phone number"
              onChange={(e) => {
                handleNumberInput(e);
                onChange(e);
              }
              }
              onBlur={onBlur}
              value={value}
            />
          )}
          defaultValue=""
        />
        <Typography variant="bodySm" color="error">
          {errors.phone_number?.message}
        </Typography>
      </Form.Item>
      <Form.Item
        label="Email address"
        name="email"
        rules={[{ required: false }]}
      >
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              placeholder="Enter email address"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          defaultValue=""
        />
        <Typography variant="bodySm" color="error">
          {errors.email?.message}
        </Typography>
      </Form.Item>
      <Form.Item
        label="Residential address"
        name="address"
        rules={[{ required: true, message: 'Residential address is required' }]}
      >
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              placeholder="Enter residential address"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          defaultValue=""
        />
        <Typography variant="bodySm" color="error">
          {errors.address?.message}
        </Typography>
      </Form.Item>
      <Form.Item
        label="Address City"
        name="city"
        rules={[{ required: true, message: 'City is required' }]}
      >
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              placeholder="Enter city"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          defaultValue=""
        />
        <Typography variant="bodySm" color="error">
          {errors.city?.message}
        </Typography>
      </Form.Item>
    </>
  );
}
