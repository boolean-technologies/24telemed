import { Navigate } from 'react-router-dom';
import { Result } from 'antd';
import { tokenManager } from '@local/shared-components';
import { lastPartnerSlug } from '../utils';

export function RootRedirect() {
  if (tokenManager.getToken()) return <Navigate to="/app" replace />;
  const slug = lastPartnerSlug.get();
  if (slug) return <Navigate to={`/${slug}`} replace />;
  return (
    <Result
      status="info"
      title="Open your clinic's link"
      subTitle="Your clinic will share a link to book and pay for your video consultation."
    />
  );
}
