import { Layout } from 'antd';
import { PageHeader } from '../../components/PageLayout';
import { PatientRegistionPage } from './PatientRegistionPage';

type RegistrationPageLayoutProps = {
  title: string;
  userId?: string;
};

export function RegistrationPageLayout({ title, userId }: RegistrationPageLayoutProps) {
  return (
    <Layout>
      <PageHeader title={title} />
      <PatientRegistionPage userId={userId} />
    </Layout>
  );
}
