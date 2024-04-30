import React from 'react';
import { Form, Input, Select } from 'antd';
import { Flex, PageLoading } from '@local/shared-components';

import { useParams } from 'react-router-dom';
import { useGetPatient } from '../../api/patient';

export const BioDataForm = () => {
  const { patientId } = useParams();

  const { data: patient, isPending } = useGetPatient(patientId);

  if (isPending) {
    return <PageLoading />;
  }

  return (
    <>
      <Form.Item
        label="First Name"
        name="first_name"
        rules={[{ required: true }]}
        initialValue={patient?.first_name}
      >
        <Input placeholder="First Name" size="large" />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="last_name"
        rules={[{ required: true }]}
        initialValue={patient?.last_name}
      >
        <Input placeholder="Last Name" size="large" />
      </Form.Item>

      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true }]}
        initialValue={patient?.gender}
      >
        <Select
          style={{ width: '100%' }}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
          ]}
          placeholder="Select Gender"
        />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phone_number"
        rules={[{ required: true }]}
        initialValue={patient?.phone_number}
      >
        <Input placeholder="Phone Number" size="large" />
      </Form.Item>
      <Flex fullWidth>
        <Form.Item
          label="Blood Type"
          name="blood_type"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
          initialValue={patient?.blood_type}
        >
          <Input placeholder="Enter blood type" />
        </Form.Item>
      </Flex>
      <Flex fullWidth>
        <Form.Item
          label="Weight (kg)"
          name="weight"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
          initialValue={patient?.weight}
        >
          <Input placeholder="Enter weight" type="number" />
        </Form.Item>
        <Form.Item
          label="Height (cm)"
          name="height"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
          initialValue={patient?.height}
        >
          <Input placeholder="Enter height" type="number" />
        </Form.Item>
      </Flex>
      <Form.Item
        label="Medical history"
        name="medical_history"
        initialValue={patient?.medical_history}
      >
        <Input.TextArea placeholder="Medical history" size="large" rows={6} />
      </Form.Item>
      <Form.Item
        label="Allergies"
        name="allergies"
        initialValue={patient?.allergies}
      >
        <Input.TextArea placeholder="Write patient's allergies here" rows={6} />
      </Form.Item>
      <Form.Item
        label="Chronic Conditions"
        name="chronic_conditions"
        initialValue={patient?.chronic_conditions}
      >
        <Input.TextArea placeholder="Write patient's condition here" rows={6} />
      </Form.Item>

      <Form.Item
        label="current_medications"
        name="current_medications"
        initialValue={patient?.current_medications}
      >
        <Input.TextArea
          placeholder="Write patient's current medication here"
          rows={6}
        />
      </Form.Item>
      <Form.Item
        label="Immunization Records"
        name="immunization_record"
        initialValue={patient?.immunization_record}
      >
        <Input.TextArea
          placeholder="Write patient's immunization records here"
          rows={6}
        />
      </Form.Item>
      <Form.Item
        label="Family Medical History"
        name="family_medical_history"
        initialValue={patient?.family_medical_history}
      >
        <Input.TextArea
          placeholder="Write patient's family medical history here"
          rows={6}
        />
      </Form.Item>
    </>
  );
};
