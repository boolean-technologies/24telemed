import { Layout } from 'antd';
import { Card, Flex } from '@local/shared-components';
import styled from 'styled-components';
import doctorImage from '../../assets/doctor.png';
import doctorsImage from '../../assets/doctors.png';
import { LoginForm } from './LoginForm';
import { AuthLayout } from '../../components/AuthLayout';

export function LoginPage() {
  return (
    <AuthLayout sideImage >
      <LoginForm />
    </AuthLayout>
  );
}


