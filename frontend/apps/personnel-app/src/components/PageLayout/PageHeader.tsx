import { Typography } from '@local/shared-components';
import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

type PageHeaderProps = {
  title: string;
};

export function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <StyledTop>
      <NavBar onBack={() => navigate(-1)} style={{ height: 60 }}>
        <Typography variant="h5" align="center">
          {title}
        </Typography>
      </NavBar>
    </StyledTop>
  );
}

const StyledTop = styled.div`
  border-bottom: solid 1px var(--adm-color-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1;
`;
