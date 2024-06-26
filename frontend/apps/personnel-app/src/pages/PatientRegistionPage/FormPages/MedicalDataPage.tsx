import { Flex, Typography } from '@local/shared-components';
import { Form, Input } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';


export function MedicalDataPage() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <Form.Item label="Medical history" name="medical_history" rules={[{ required: true }]}>
        <Controller
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input.TextArea
              placeholder="Write patient's medical data here"
              rows={6}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          name="medical_history"
          defaultValue=""
          control={control}
        />
        {errors.medical_history && (
          <Typography variant="bodySm" color="error">
            {errors.medical_history?.message}
          </Typography>
        )}
      </Form.Item>
      <Form.Item label="Allergies" name="allergies" rules={[{ required: true }]}>
        <Controller
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input.TextArea
              placeholder="Write patient's allergies here"
              rows={6}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          name="allergies"
          defaultValue=""
          control={control}
        />
        {errors.allergies && (
          <Typography variant="bodySm" color="error">
            {errors.allergies?.message}
          </Typography>
        )}
      </Form.Item>
      <Form.Item label="Chronic Conditions" name="chronic_conditions" rules={[{ required: true }]}>
        <Controller
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input.TextArea
              placeholder="Write patient's chronic conditions here"
              rows={6}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          name="chronic_conditions"
          defaultValue=""
          control={control}
        />
        {errors.chronic_conditions && (
          <Typography variant="bodySm" color="error">
            {errors.chronic_conditions?.message}
          </Typography>
        )}
      </Form.Item>
      <Flex fullWidth>
        <Form.Item
          label="Blood Type"
          name="blood_type"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Controller
            control={control}
            name="blood_type"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                placeholder="Enter Blood Type"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            defaultValue=""
          />

          {errors.blood_type && (
            <Typography variant="bodySm" color="error">
              {errors.blood_type?.message}
            </Typography>
          )}
        </Form.Item>
        <Form.Item
          label="Genotype"
          name="genetype"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Controller
            control={control}
            name="genetype"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                placeholder="Enter Genotype"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            defaultValue=""
          />
          {errors.genetype && (
            <Typography variant="bodySm" color="error">
              {errors.genetype?.message}
            </Typography>
          )}
        </Form.Item>
      </Flex>
      <Flex fullWidth>
        <Form.Item
          label="Weight (kg)"
          name="weight"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                placeholder="Enter weight"
                type="number"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            defaultValue=""
          />
          {errors.weight && (
            <Typography variant="bodySm" color="error">
              {errors.weight?.message}
            </Typography>
          )}
        </Form.Item>
        <Form.Item
          label="Height (cm)"
          name="height"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Controller
            control={control}
            name="height"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                placeholder="Enter height"
                type="number"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            defaultValue=""
          />
          {errors.height && (
            <Typography variant="bodySm" color="error">
              {errors.height?.message}
            </Typography>
          )}
        </Form.Item>
      </Flex>
      <Form.Item label="Immunization Records" name="immunization_records" rules={[{ required: true }]}>
        <Controller
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input.TextArea
              placeholder="Write patient's immunization records here"
              rows={6}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          name="immunization_records"
          defaultValue=""
          control={control}
        />
        {errors.immunization_records && (
          <Typography variant="bodySm" color="error">
            {errors.immunization_records?.message}
          </Typography>
        )}
      </Form.Item>
      <Form.Item label="Family Medical History" name="family_medical_history" rules={[{ required: true }]}>
        <Controller
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input.TextArea
              placeholder="Write patient's family medical history here"
              rows={6}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          name="family_medical_history"
          defaultValue=""
          control={control}
        />
        {errors.family_medical_history && (
          <Typography variant="bodySm" color="error">
            {errors.family_medical_history?.message}
          </Typography>
        )}
      </Form.Item>
    </>
  );
}
