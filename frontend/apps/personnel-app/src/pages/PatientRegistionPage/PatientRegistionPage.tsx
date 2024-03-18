import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageLayout';
import { Card, Flex } from '@local/shared-components';
import { FormHeader } from './FormHeader';
import styled from 'styled-components';
import { StepStateProps } from './FormHeader/StepState';
import { Form, Layout } from 'antd';
import { useFormWizardNavigation } from './useFormWizardNavigation';
import { BioDataPage } from './FormPages/BioDataPage';
import { MedicalDataPage } from './FormPages/MedicalDataPage';
import { ContactDataPage } from './FormPages/ContactDataPage';
import { PreviewPage } from './FormPages/PreviewPage';
import { Button } from 'antd-mobile';

export function PatientRegistionPage() {
  const navigate = useNavigate();

  const { step, goToStep, goBack, goNext } = useFormWizardNavigation(4);

  const steps: StepStateProps[] = [
    {
      state: 'completed',
      position: 0,
      name: 'Bio Data',
      onStep: () => goToStep(0),
    },
    {
      state: 'progress',
      position: 1,
      name: 'Medical Data',
      onStep: () => goToStep(1),
    },
    {
      state: 'pending',
      position: 2,
      name: 'Contact Data',
      onStep: () => goToStep(2),
    },
    {
      state: 'pending',
      position: 3,
      name: 'Preview',
      onStep: () => goToStep(3),
    },
  ];

  const onFinish = (data: any) => {
    console.log(data);
  };

  return (
    <Layout>
      <PageHeader title="New Patient" />
      <StyledRoot padding="md" direction="column">
        <FormHeader steps={steps} current={step} total={steps.length} />
        <Card fullHeight>
          <Form name="newPatient" layout="vertical" onFinish={onFinish}>
            {step === 0 ? <BioDataPage /> : null}
            {step === 1 ? <MedicalDataPage /> : null}
            {step === 2 ? <ContactDataPage /> : null}
            {step === 3 ? <PreviewPage /> : null}
          </Form>
        </Card>
        <Flex fullWidth justify="space-between">
          {step === 0 ? <div /> : <Button onClick={goBack}>Previous</Button>}
          {step === steps.length - 1 ? (
            <Button color="primary" onClick={goNext}>
              Submit
            </Button>
          ) : (
            <Button color="primary" onClick={goNext}>
              Next
            </Button>
          )}
        </Flex>
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
