import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, DatePicker, Form, Input, Result, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { PageLoading, tokenManager } from '@local/shared-components';
import { RegistrationInput, usePartner, useRegister } from '../api/partners';
import { errorMessage } from '../api/client';
import { AuthCard } from '../components/AuthCard';
import { Shell } from '../components/Shell';
import { lastPartnerSlug } from '../utils';

type FormValues = Omit<RegistrationInput, 'date_of_birth'> & { date_of_birth: Dayjs; confirm: string };

export function SignupPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: partner, isLoading } = usePartner(slug);
  const register = useRegister(slug);

  if (isLoading) return <PageLoading />;
  if (!partner) return <Result status="404" title="Clinic not found" />;

  const onFinish = ({ confirm, date_of_birth, ...values }: FormValues) => {
    register.mutate(
      { ...values, date_of_birth: date_of_birth.format('YYYY-MM-DD') },
      {
        onSuccess: ({ access }) => {
          tokenManager.setToken(access);
          lastPartnerSlug.set(partner.slug);
          queryClient.clear();
          navigate('/app', { replace: true });
        },
      }
    );
  };

  return (
    <Shell partnerName={partner.name} logoUrl={partner.logo_url}>
      <AuthCard
        title="Create your account"
        subtitle={<>Register as a patient of {partner.name} to book and pay for video consultations.</>}
      >
        {register.isError && <Alert type="error" showIcon message={errorMessage(register.error)} style={{ marginBottom: 16 }} />}
        <Form<FormValues> layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="first_name" label="First name" rules={[{ required: true }]}>
            <Input autoComplete="given-name" />
          </Form.Item>
          <Form.Item name="last_name" label="Last name" rules={[{ required: true }]}>
            <Input autoComplete="family-name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]} extra="Your payment receipt is sent here.">
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item name="phone_number" label="Phone number" rules={[{ required: true }, { max: 15 }]}>
            <Input autoComplete="tel" inputMode="tel" />
          </Form.Item>
          <Form.Item name="date_of_birth" label="Date of birth" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabledDate={(d) => d.isAfter(new Date())} />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select options={[{ value: 'Female', label: 'Female' }, { value: 'Male', label: 'Male' }]} />
          </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input autoComplete="username" autoCapitalize="none" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm password"
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  !value || getFieldValue('password') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Passwords do not match')),
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={register.isPending}>
            Create account
          </Button>
        </Form>
        <p style={{ marginTop: 16, textAlign: 'center' }}>
          Already registered? <Link to={`/${partner.slug}/login`}>Sign in</Link>
        </p>
      </AuthCard>
    </Shell>
  );
}
