import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageLayout';
import { Card, Flex } from '@local/shared-components';
import styled from 'styled-components';
import { StepStateProps } from './FormHeader/StepState';
import { Form, Layout, Steps } from 'antd';
import { useFormWizardNavigation } from './useFormWizardNavigation';
import { BioDataPage, BiopageSchema } from './FormPages/BioDataPage';
import {
  MedicalDataPage,
  MedicalDataSchema,
} from './FormPages/MedicalDataPage';
import {
  ContactDataPage,
  ContactDataSchema,
} from './FormPages/ContactDataPage';
import { PreviewPage } from './FormPages/PreviewPage';
import { Button } from 'antd-mobile';
import { useState, useEffect } from 'react';
import { Patient } from '@local/api-generated';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type RegistrationFormField = {
  phone_number: string;
  first_name: string;
  last_name: string;
  age: number;
  date_of_birth: string;
  gender: string;
  email: string;
  address: string;
  medical_history: string;
  allergies: string;
  current_medications: string;
  blood_type: string;
  weight: number;
  height: number;
  chronic_conditions: string;
  immunization_record: string;
  family_medical_history: string;
};

const schema = yup.object().shape({
  phone_number: yup.string().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  age: yup.number().required(),
  date_of_birth: yup.string().required(),
  gender: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  medical_history: yup.string().required(),
  allergies: yup.string().required(),
  current_medications: yup.string().required(),
  blood_type: yup.string().required(),
  weight: yup.number().required(),
  height: yup.number().required(),
  chronic_conditions: yup.string().required(),
  immunization_record: yup.string().required(),
  family_medical_history: yup.string().required(),
});

export function PatientRegistionPage() {
  const [current, setCurrent] = useState<number>(0);
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(
      current === 0
        ? BiopageSchema
        : current === 1
        ? ContactDataSchema
        : MedicalDataSchema

    ),
  });
  const navigate = useNavigate();
  const onFinish = (data: RegistrationFormField) => {};
  const [StepForm] = Form.useForm();

  const next = () => {
    setCurrent(current + 1);
    console.log(errors);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: 'Bio Data',
      content: <BioDataPage control={control} errors={errors} />,
    },
    {
      title: 'Contact Data',
      content: <ContactDataPage control={control} errors={errors} />,
    },
    {
      title: 'Medical Data',
      content: <MedicalDataPage control={control} errors={errors} />,
    },

    {
      title: 'Preview',
      content: <PreviewPage />,
    },
  ];

  // scroll to top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

  return (
    <Layout>
      <PageHeader title="New Patient" />
      <StyledRoot padding="md" direction="column">
        <Card fullHeight>
          <Form name="newPatient" layout="vertical" onFinish={onFinish} form={StepForm}>
            <Steps current={current}>
              {steps.map((item) => (
                <Steps.Step key={item.title} title={item.title} />
              ))}
            </Steps>
            {steps[current].content}
            {
              <Flex justify="space-between" padding="md">
                {current > 0 && (
                  <Button type="button" color="default" onClick={prev}>
                    Previous
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button
                    type="button"
                    color="primary"
                    onClick={handleSubmit(next)}
                  >
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button type="submit" htmlType="submit">
                    Submit
                  </Button>
                )}
              </Flex>
            }
          </Form>
        </Card>
      </StyledRoot>
    </Layout>
  );
}

const StyledRoot = styled(Flex)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 60px;
  width: 100vw;
  height: calc(100vh - 60px);
  overflow: scroll;
`;
