import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageLayout';
import { Card, Flex, defaultTheme } from '@local/shared-components';
import styled from 'styled-components';
import { Form, Layout, Steps } from 'antd';
import { BioDataPage } from './FormPages/BioDataPage';
import { MedicalDataPage } from './FormPages/MedicalDataPage';
import { ContactDataPage } from './FormPages/ContactDataPage';
import { PreviewPage } from './FormPages/PreviewPage';
import { Button } from 'antd-mobile';
import { useState, useCallback, useRef, useEffect } from 'react';
import { calculateAge, parseApiError } from '@local/api-generated';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreatePatient } from '../../api/patient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiopageSchema } from './FormPages/formSchema';
import { MedicalDataSchema } from './FormPages/formSchema';
import { ContactDataSchema } from './FormPages/formSchema';
import {
  UserOutlined,
  SolutionOutlined,
  DatabaseOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
export type RegistrationFormField = yup.InferType<typeof BiopageSchema> &
  yup.InferType<typeof ContactDataSchema> &
  yup.InferType<typeof MedicalDataSchema>;

export function PatientRegistionPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<number>(0);
  const { mutate, isPending } = useCreatePatient();
  const navigate = useNavigate();

  const schema:
    | yup.ObjectSchema<any, yup.AnyObject, any, ''>
    | yup.Lazy<any, yup.AnyObject, any> =
    current === 0
      ? BiopageSchema
      : current === 1
      ? ContactDataSchema
      : MedicalDataSchema;
  const methods = useForm<RegistrationFormField>({
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    const patient = methods.getValues();
    mutate(
      {
        ...patient,
        age: calculateAge(patient.date_of_birth),
        date_of_birth: patient.date_of_birth.toISOString().split('T')[0],
      },
      {
        onSuccess: (data) => {
          toast.success('Patient created successfully');

          navigate(`/patient/${data.id}`, {
            replace: true,
          });
        },
        onError: (error) => {
          toast.error(`${parseApiError(error)}, Please try again`, {
            position: toast.POSITION.TOP_CENTER,
          });
        },
      }
    );
  };

  const next = useCallback(() => {
    setCurrent(current + 1);
  }, [current]);

  const prev = useCallback(() => {
    setCurrent(current - 1);
  }, [current]);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [current]);

  const steps = [
    {
      title: 'Bio Data',
      content: <BioDataPage />,
      icon: <UserOutlined />,
      
      
    },
    {
      title: 'Contact Data',
      content: <ContactDataPage />,
      icon: <SolutionOutlined />,
      
    },
    {
      title: 'Medical Data',
      content: <MedicalDataPage />,
      icon: <MedicineBoxOutlined />,
      
    },

    {
      title: 'Preview',
      content: <PreviewPage />,
      icon: <DatabaseOutlined />,
      
    },
  ];

  return (
    <Layout>
      <PageHeader title="New Patient" />
      <StyledRoot padding="md" direction="column" ref={pageRef}>
        <Card fullHeight>
          <FormProvider {...methods}>
            <Form name="newPatient" layout="vertical">
              <Steps
                current={current}
                style={{
                  color: defaultTheme.palette.primary2.main,
                  borderColor: defaultTheme.palette.primary1.main,
                  marginBottom: '20px',
                }}
              >
                {steps.map((item) => (
                  <Steps.Step key={item.title} title={item.title} icon={item.icon} />
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
                      onClick={methods.handleSubmit(next)}
                      style={{ marginLeft: 'auto' }}
                    >
                      Next
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button
                      type="submit"
                      color="primary"
                      onClick={onSubmit}
                      loading={isPending}
                    >
                      Submit
                    </Button>
                  )}
                </Flex>
              }
            </Form>
          </FormProvider>
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
