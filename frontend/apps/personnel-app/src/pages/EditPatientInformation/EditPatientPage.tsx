import { Flex, FormWrapper } from '@local/shared-components';
import { Layout } from 'antd';
import type { RegistrationFormField } from '../PatientRegistionPage';
import { PageHeader } from '../../components/PageLayout';
import { BioDataForm } from './EditPatientForm';
import styled from 'styled-components';
import { useUpdatePatient } from '../../api/patient';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function EditPatientPage() {
    const navigate = useNavigate();
  const { patientId } = useParams();
  const { mutate, isPending } = useUpdatePatient();

  const onFinish = (values: RegistrationFormField) => {
    mutate({
      id: patientId as string,
      data: values as any,
    }, {
        onSuccess: () => {
        toast.success('Patient updated successfully');
        navigate(-1);
      },
      onError: () => {
        toast.error('Failed to update patient');
      },
    });
  };

  return (
    <Layout>
      <PageHeader title="Edit Patient Information" />
      <StyledRoot padding="md" direction="column">
        <FormWrapper
          name="EditPatient"
          onFinish={onFinish}
          isLoading={isPending}
        >
          <BioDataForm />
        </FormWrapper>
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
  background-color: white;
`;
