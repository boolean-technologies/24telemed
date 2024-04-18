import { Flex, Typography } from '@local/shared-components';
import { DatePicker, Form, Input, Select } from 'antd';
import { log } from 'console';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
type RegistrationFormField = {
  phone_number: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  identification_type: string;
  identification_number: string;
};

interface BioDataPageProps {
  control: any;
  errors: any;
}

export const BiopageSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required '),
  gender: yup.string().required(' Gender is required'),
  date_of_birth: yup.string().required('Date of birth is required'),
  identification_type: yup.string().required('Identification type is required'),
  identification_number: yup
    .string()
    .required('Identification number is required'),
});

export function BioDataPage({ control, errors }: BioDataPageProps) {
  console.log('bioeror', errors);

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
      </Form.Item>
      {errors.first_name && (
        <Typography variant="bodySm" color="error">
          {errors.first_name?.message}
        </Typography>
      )}
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
        {
           errors.gender?.message &&
          <Typography variant="bodySm" color="error">
          {errors.gender?.message}
        </Typography>}
      </Form.Item>
      <Form.Item label="Date of Birth" name="date_of_birth" style={{ flex: 1 }}>
        <Controller
          control={control}
          name="date_of_birth"
          render={({ field }) => (
            <DatePicker {...field} style={{ width: '100%' }} />
          )}
        />
        {
          errors.date_of_birth?.message &&
          <Typography variant="bodySm" color="error">
          {errors.date_of_birth?.message}
        </Typography>}
      </Form.Item>
      <Flex fullWidth>
        <Form.Item
          label="Identification Type"
          name="identification_type"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Controller
            control={control}
            name="identification_type"
            render={({ field }) => (
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
                {...field}
              />
            )}
          />
          {
            errors.identification_type?.message &&
            <Typography variant="bodySm" color="error">
            {errors.identification_type?.message}
          </Typography>}
        </Form.Item>
        <Form.Item
          label="Identification number"
          name="identification_number"
          style={{ flex: 1 }}
        >
          <Controller
            control={control}
            name="identification_number"
            render={({ field }) => (
              <Input {...field} placeholder="Enter identification number" />
            )}
          />
          {
            errors.identification_number?.message &&
            <Typography variant="bodySm" color="error">
            {errors.identification_number?.message}
          </Typography>}
        </Form.Item>
      </Flex>
    </>
  );
}
