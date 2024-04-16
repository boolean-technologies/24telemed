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
  }
]
export function PatientRegistionPage() {
  

  const navigate = useNavigate();
  const onFinish = (data: any) => {
    console.log(data);
  };
  const [current, setCurrent] = useState<number>(0)
  const next = () => {
    setCurrent(current + 1)
  }
  const prev = () => {
    setCurrent(current - 1)
  }

  // scroll to top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ current ]);

  return (
    <Layout>
      <PageHeader title="New Patient" />
      <StyledRoot padding="md" direction="column">
        <Card fullHeight>
          <Form name="newPatient" layout="vertical" onFinish={onFinish}>
            <Steps current={current}

            >
              {steps.map((item) => (
                <Steps.Step key={item.title} title={item.title} />
              ))}
            </Steps>
            {steps[current].content}
            {current < steps.length - 1 && (
              <Button onClick={next} type="primary">
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button onClick={prev} type="primary">
                Previous
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button onClick={() => navigate('/patient-list')} type="primary">
                Submit
              </Button>
            )}
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
