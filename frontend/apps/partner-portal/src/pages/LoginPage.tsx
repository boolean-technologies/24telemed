import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Form, Input, Result } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { PageLoading, usePersonnelLogin } from '@local/shared-components';
import { usePartner } from '../api/partners';
import { AuthCard } from '../components/AuthCard';
import { Shell } from '../components/Shell';
import { lastPartnerSlug } from '../utils';

export function LoginPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: partner, isLoading } = usePartner(slug);
  const login = usePersonnelLogin();

  if (isLoading) return <PageLoading />;
  if (!partner) return <Result status="404" title="Clinic not found" />;

  const onFinish = (values: { username: string; password: string }) => {
    login.performLogin(values, () => {
      lastPartnerSlug.set(partner.slug);
      queryClient.clear();
      navigate('/app', { replace: true });
    });
  };

  return (
    <Shell partnerName={partner.name} logoUrl={partner.logo_url}>
      <AuthCard title="Sign in" subtitle={<>Welcome back to {partner.name}.</>}>
        {login.isError && <Alert type="error" showIcon message="Invalid username or password" style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input autoComplete="username" autoCapitalize="none" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={login.isPending}>
            Sign in
          </Button>
        </Form>
        <p style={{ marginTop: 16, textAlign: 'center' }}>
          New here? <Link to={`/${partner.slug}/signup`}>Create an account</Link>
        </p>
      </AuthCard>
    </Shell>
  );
}
