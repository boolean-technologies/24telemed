import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Result, Steps, Typography } from 'antd';
import styled from 'styled-components';
import { PageLoading, tokenManager } from '@local/shared-components';
import { usePartner } from '../api/partners';
import { CardGrid, ServiceCard } from '../components/ServiceCard';
import { Section, SectionTitle, Shell } from '../components/Shell';
import { lastPartnerSlug } from '../utils';

const { Paragraph } = Typography;

export function LandingPage() {
  const { slug } = useParams();
  const { data: partner, isLoading } = usePartner(slug);
  const signedIn = !!tokenManager.getToken();

  useEffect(() => {
    if (partner) lastPartnerSlug.set(partner.slug);
  }, [partner]);

  if (isLoading) return <PageLoading />;
  if (!partner) {
    return <Result status="404" title="Clinic not found" subTitle="Check the link your clinic sent you." />;
  }

  const cta = signedIn ? (
    <Link to="/app">
      <Button type="primary">My consultations</Button>
    </Link>
  ) : (
    <>
      <Link to={`/${partner.slug}/login`}>
        <Button>Sign in</Button>
      </Link>
      <Link to={`/${partner.slug}/signup`}>
        <Button type="primary">Create account</Button>
      </Link>
    </>
  );

  return (
    <Shell partnerName={partner.name} logoUrl={partner.logo_url} actions={cta}>
      <Hero>
        <h1>{partner.tagline || `Consult ${partner.name} doctors online`}</h1>
        {partner.description && <Paragraph type="secondary">{partner.description}</Paragraph>}
      </Hero>

      <Section>
        <Steps
          direction="horizontal"
          responsive
          size="small"
          items={[
            { title: 'Create an account', status: 'process' },
            { title: 'Choose a service & pay', status: 'process' },
            { title: 'Video call your doctor', status: 'process' },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle>Services</SectionTitle>
        <CardGrid>
          {partner.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              action={
                <Link to={signedIn ? '/app' : `/${partner.slug}/signup`}>
                  <Button type="primary" block>
                    Book this consultation
                  </Button>
                </Link>
              }
            />
          ))}
        </CardGrid>
      </Section>

      {(partner.contact_phone || partner.contact_email) && (
        <Paragraph type="secondary">
          Questions? Contact {partner.name}
          {partner.contact_phone && <> on <a href={`tel:${partner.contact_phone}`}>{partner.contact_phone}</a></>}
          {partner.contact_email && <> or <a href={`mailto:${partner.contact_email}`}>{partner.contact_email}</a></>}.
        </Paragraph>
      )}
    </Shell>
  );
}

const Hero = styled.div`
  margin-bottom: 24px;

  h1 {
    font-size: clamp(24px, 5vw, 34px);
    font-weight: 700;
    margin: 0 0 8px;
  }
`;
