import { Link, useParams } from 'react-router-dom';
import { Alert, Avatar, Badge, Button, Card, List, Result, Skeleton, Typography } from 'antd';
import { CallMessage, usePersonnelCommunication } from '@local/websocket';
import { PartnerDoctor, useConsultation } from '../api/partners';
import { ConsultationStatusTag } from '../components/ConsultationStatusTag';
import { useSession } from '../components/SessionLayout';
import { Section, SectionTitle } from '../components/Shell';
import { doctorName, formatMoney } from '../utils';

const { Paragraph, Text } = Typography;

const MEDIUM_PRIORITY = 2;

export function ConsultationPage() {
  const { id } = useParams();
  const { user, partner } = useSession();
  const { data: consultation, isLoading } = useConsultation(id);
  const { availableDoctors, callDoctor, isOpen } = usePersonnelCommunication();

  if (isLoading) return <Skeleton active />;
  if (!consultation) {
    return <Result status="404" title="Consultation not found" extra={<Link to="/app"><Button>Back</Button></Link>} />;
  }

  const service = consultation.service_detail;
  const online = new Set(availableDoctors);
  const doctors = [...service.doctors].sort((a, b) => Number(online.has(b.id)) - Number(online.has(a.id)));
  const anyOnline = doctors.some((doctor) => online.has(doctor.id));

  const call = (doctor: PartnerDoctor) => {
    // The backend checks this consultation is paid and that the doctor
    // belongs to its service before ringing them.
    const message: CallMessage & { partnerConsultationId: string } = {
      doctorId: doctor.id,
      patientId: (consultation.patient ?? user.patient_id) as string,
      note: consultation.reason,
      priority: MEDIUM_PRIORITY,
      partnerConsultationId: consultation.id,
    };
    callDoctor(message);
  };

  return (
    <>
      <Section>
        <Link to="/app">← My consultations</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '12px 0 4px' }}>{service.name}</h1>
        <ConsultationStatusTag status={consultation.status} />
        <Text type="secondary">{formatMoney(consultation.amount, consultation.currency)}</Text>
      </Section>

      {consultation.status === 'pending_payment' && (
        <Alert type="warning" showIcon message="Payment not received yet" description="Complete payment from your consultations page to call a doctor." />
      )}
      {consultation.status === 'completed' && (
        <Alert type="success" showIcon message="This consultation is complete" description="Book a new consultation any time from your consultations page." />
      )}

      {consultation.status === 'paid' && (
        <Section>
          <SectionTitle>Call a doctor</SectionTitle>
          <Paragraph type="secondary">
            Doctors shown as online can take your call now. Allow camera and microphone access when your browser asks.
          </Paragraph>
          {!isOpen && <Alert type="info" showIcon message="Connecting…" style={{ marginBottom: 12 }} />}
          <Card styles={{ body: { padding: '0 16px' } }}>
            <List
              dataSource={doctors}
              locale={{ emptyText: 'No doctors are assigned to this service yet.' }}
              renderItem={(doctor) => {
                const isOnline = online.has(doctor.id);
                return (
                  <List.Item
                    actions={[
                      <Button key="call" type="primary" disabled={!isOnline || !isOpen} onClick={() => call(doctor)}>
                        Call
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot status={isOnline ? 'success' : 'default'} offset={[-4, 36]}>
                          <Avatar src={doctor.photo || undefined} size={40}>{doctor.first_name?.charAt(0)}</Avatar>
                        </Badge>
                      }
                      title={doctorName(doctor)}
                      description={[doctor.specialty, isOnline ? 'Online' : 'Offline'].filter(Boolean).join(' · ')}
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
          {!anyOnline && doctors.length > 0 && (
            <Paragraph type="secondary" style={{ marginTop: 12 }}>
              No doctor is online right now. Your payment is safe, so come back later
              {partner.contact_phone && (
                <>
                  {' '}or call {partner.name} on <a href={`tel:${partner.contact_phone}`}>{partner.contact_phone}</a> to arrange a time
                </>
              )}
              .
            </Paragraph>
          )}
        </Section>
      )}
    </>
  );
}
