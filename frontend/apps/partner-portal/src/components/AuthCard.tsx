import { ReactNode } from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <Wrapper>
      <Card>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {children}
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  color: #505a5b;
  margin: 0 0 20px;
`;
