import { ReactNode } from 'react';
import { Avatar, Card, Typography } from 'antd';
import styled from 'styled-components';
import { PartnerService } from '../api/partners';
import { doctorName, formatMoney } from '../utils';

const { Paragraph, Text } = Typography;

export function ServiceCard({ service, action }: { service: PartnerService; action?: ReactNode }) {
  return (
    <Card>
      <Top>
        <div>
          <Title>{service.name}</Title>
          {service.description && <Paragraph type="secondary" style={{ marginBottom: 8 }}>{service.description}</Paragraph>}
        </div>
        <Fee>{formatMoney(service.fee, service.currency)}</Fee>
      </Top>
      {service.doctors.length > 0 && (
        <Doctors>
          {service.doctors.map((doctor) => (
            <Doctor key={doctor.id}>
              <Avatar src={doctor.photo || undefined} size="small">{doctor.first_name?.charAt(0)}</Avatar>
              <Text>{doctorName(doctor)}</Text>
              {doctor.specialty && <Text type="secondary">· {doctor.specialty}</Text>}
            </Doctor>
          ))}
        </Doctors>
      )}
      {action && <Footer>{action}</Footer>}
    </Card>
  );
}

export const CardGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
`;

const Fee = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #33ada3;
  white-space: nowrap;
`;

const Doctors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Doctor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Footer = styled.div`
  margin-top: 16px;
`;
