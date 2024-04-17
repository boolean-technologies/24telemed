import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageLayout';
import { Card, Flex } from '@local/shared-components';
import styled from 'styled-components';
import { StepStateProps } from './FormHeader/StepState';
import { Form, Layout, Steps } from 'antd';
import { useFormWizardNavigation } from './useFormWizardNavigation';
import { BioDataPage } from './FormPages/BioDataPage';
import { MedicalDataPage } from './FormPages/MedicalDataPage';
import { ContactDataPage } from './FormPages/ContactDataPage';
import { PreviewPage } from './FormPages/PreviewPage';
import { Button } from 'antd-mobile';
import { useState, useEffect } from 'react';
import { Patient } from '@local/api-generated';

const steps = [
  {
    title: 'Bio Data',
    content: <BioDataPage />,
  },
  {
    title: 'Medical Data',
    content: <MedicalDataPage />,
  },
  {
    title: 'Contact Data',
    content: <ContactDataPage />,
  },
  {
    title: 'Preview',
    content: <PreviewPage />,
  },
];

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
  }

export function PatientRegistionPage() {
  const [stepForm] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = (data: RegistrationFormField) => {
    const formData = stepForm.getFieldsValue(true);
    console.log(formData);
  };
  const [current, setCurrent] = useState<number>(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  // scroll to top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

  return (
    <Layout>
      <PageHeader title="New Patient" />
      <StyledRoot padding="md" direction="column">
        <Card fullHeight>
          <Form name="newPatient" layout="vertical" onFinish={onFinish} form={stepForm}>
          
            <Steps current={current}>
              {steps.map((item) => (
                <Steps.Step key={item.title} title={item.title} />
              ))}
            </Steps>
            {steps[current].content}
            {
              <Flex justify="space-between" padding="md">
                {current > 0 && (
                  <Button type="button" onClick={prev} color="default">
                    Previous
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button type="button" onClick={next} color="primary">
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
