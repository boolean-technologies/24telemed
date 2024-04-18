import { Typography } from '@local/shared-components';
import { Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

export const ContactDataSchema = yup.object().shape({
  phone_number: yup.string().required('Phone number is required'),
  email_address: yup.string().email().required('Email address is required'),
  address: yup.string().required('Residential address is required'),
  city: yup.string().required('City is required'),
});

interface ContactDataPageProps {
  control: any;
  errors : any;
}
export function ContactDataPage({ control, errors }: ContactDataPageProps) {
  console.log(errors);
  

  return (
    <>
      <Form.Item label="Phone number" name="phone_number">
        <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              placeholder="Enter phone number"
              onChange={onChange}
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
      <Form.Item label="Email address" name="email_address">
        <Controller
          control={control}
          name="email_address"
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
          {errors.email_address?.message}
        </Typography>
      </Form.Item>
      <Form.Item label="Residential address" name="address">
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
      <Form.Item label="Address City" name="city">
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
