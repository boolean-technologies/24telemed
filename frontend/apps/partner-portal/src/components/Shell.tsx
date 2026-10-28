import { ReactNode } from 'react';
import { Avatar } from 'antd';
import styled from 'styled-components';

type ShellProps = {
  partnerName?: string;
  logoUrl?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/** Page frame shared by the public and signed-in pages. */
export function Shell({ partnerName, logoUrl, actions, children }: ShellProps) {
  return (
    <Page>
      <Header>
        <Brand>
          <Avatar src={logoUrl || undefined} size={40} style={{ background: '#33ada3', flexShrink: 0 }}>
            {partnerName?.charAt(0)}
          </Avatar>
          <BrandName>{partnerName || '24Telemed'}</BrandName>
        </Brand>
        {actions && <Actions>{actions}</Actions>}
      </Header>
      <Main>{children}</Main>
      <Footer>Video consultations powered by 24Telemed</Footer>
    </Page>
  );
}

export const Section = styled.section`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px;
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8f8;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eaedee;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const BrandName = styled.span`
  font-weight: 700;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const Footer = styled.footer`
  text-align: center;
  font-size: 12px;
  color: #a0a4a5;
  padding: 16px;
`;
