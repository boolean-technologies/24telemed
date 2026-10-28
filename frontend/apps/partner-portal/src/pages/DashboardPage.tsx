import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Empty, Input, List, Modal, Skeleton, Typography } from 'antd';
import {
  Consultation,
  PartnerService,
  useConsultations,
  useRetryCheckout,
  useStartCheckout,
} from '../api/partners';
import { errorMessage } from '../api/client';
import { ConsultationStatusTag } from '../components/ConsultationStatusTag';
import { CardGrid, ServiceCard } from '../components/ServiceCard';
import { useSession } from '../components/SessionLayout';
import { Section, SectionTitle } from '../components/Shell';
import { formatMoney } from '../utils';

const { Paragraph, Text } = Typography;

export function DashboardPage() {
  const { user, partner } = useSession();
  const consultations = useConsultations();
  const [booking, setBooking] = useState<PartnerService | null>(null);

  const ready = consultations.data?.filter((c) => c.status === 'paid') ?? [];

  return (
    <>
      <Section>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Hello, {user.first_name || user.username}</h1>
        <Paragraph type="secondary">Book a consultation with {partner.name}, pay securely, then video call your doctor.</Paragraph>
      </Section>

      {ready.length > 0 && (
        <Section>
          <SectionTitle>Ready to start</SectionTitle>
          <CardGrid>
            {ready.map((consultation) => (
              <Card key={consultation.id}>
                <Text strong>{consultation.service_detail.name}</Text>
                <Paragraph type="secondary" style={{ margin: '4px 0 12px' }}>
                  Paid {formatMoney(consultation.amount, consultation.currency)}
                </Paragraph>
                <Link to={`/app/consultations/${consultation.id}`}>
                  <Button type="primary" block>
                    Start consultation
                  </Button>
                </Link>
              </Card>
            ))}
          </CardGrid>
        </Section>
      )}

      <Section>
        <SectionTitle>Book a consultation</SectionTitle>
        <CardGrid>
          {partner.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              action={
                <Button type="primary" block onClick={() => setBooking(service)}>
                  Book &amp; pay {formatMoney(service.fee, service.currency)}
                </Button>
              }
            />
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionTitle>My consultations</SectionTitle>
        {consultations.isLoading ? (
          <Skeleton active />
        ) : consultations.data?.length ? (
          <Card styles={{ body: { padding: '0 16px' } }}>
            <List
              dataSource={consultations.data}
              renderItem={(consultation) => <ConsultationRow consultation={consultation} />}
            />
          </Card>
        ) : (
          <Empty description="No consultations yet" />
        )}
      </Section>

      {booking && <CheckoutModal service={booking} onClose={() => setBooking(null)} />}
    </>
  );
}

function ConsultationRow({ consultation }: { consultation: Consultation }) {
  const retry = useRetryCheckout();
  const action =
    consultation.status === 'paid' ? (
      <Link to={`/app/consultations/${consultation.id}`}>
        <Button type="primary">Start</Button>
      </Link>
    ) : consultation.status === 'pending_payment' ? (
      <Button
        loading={retry.isPending}
        onClick={() =>
          retry.mutate(consultation.id, {
            onSuccess: ({ authorization_url }) => authorization_url && window.location.assign(authorization_url),
          })
        }
      >
        Pay now
      </Button>
    ) : null;

  return (
    <List.Item actions={action ? [action] : undefined}>
      <List.Item.Meta
        title={consultation.service_detail.name}
        description={
          <>
            <ConsultationStatusTag status={consultation.status} />
            <Text type="secondary">
              {formatMoney(consultation.amount, consultation.currency)} · {new Date(consultation.created_at).toLocaleDateString()}
            </Text>
            {retry.isError && <div><Text type="danger">{errorMessage(retry.error)}</Text></div>}
          </>
        }
      />
    </List.Item>
  );
}

function CheckoutModal({ service, onClose }: { service: PartnerService; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const checkout = useStartCheckout();

  const pay = () =>
    checkout.mutate(
      { service: service.id, reason },
      {
        onSuccess: ({ authorization_url }) => {
          if (authorization_url) window.location.assign(authorization_url);
        },
      }
    );

  return (
    <Modal
      open
      centered
      title={service.name}
      onCancel={onClose}
      okText={`Pay ${formatMoney(service.fee, service.currency)}`}
      onOk={pay}
      confirmLoading={checkout.isPending}
    >
      <Paragraph type="secondary">
        You'll be taken to Paystack to pay securely by card, bank transfer or USSD. After payment you can video call a
        doctor for this service.
      </Paragraph>
      <Paragraph strong style={{ marginBottom: 6 }}>
        What would you like to discuss? (optional)
      </Paragraph>
      <Input.TextArea
        rows={3}
        maxLength={2000}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Briefly describe your symptoms or concerns. Only your doctor sees this."
      />
      {checkout.isError && <Alert type="error" showIcon message={errorMessage(checkout.error)} style={{ marginTop: 12 }} />}
    </Modal>
  );
}
