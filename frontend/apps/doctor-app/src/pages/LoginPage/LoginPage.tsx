import { Layout } from 'antd';
import { Card, Flex } from '@local/shared-components';
import styled from 'styled-components';
import doctorImage from '../../assets/doctor.png';
import doctorsImage from '../../assets/doctors.png';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <StyledRoot>
      <Flex fullHeight fullWidth align="center" justify="center">
        <StyledLoginBox>
          <StyledCard>
            <Flex gap="none" fullHeight align="stretch">
              <StyledSideImage />
              <Flex fullHeight fullWidth padding="md">
                <LoginForm />
              </Flex>
            </Flex>
          </StyledCard>
        </StyledLoginBox>
        <StyledBackgrounImage />
        <StyledBackgroundGradient />
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Layout)`
  width: 100vw;
  height: 100vh;
`;

const StyledLoginBox = styled(Flex)`
  width: 100%;
  max-width: 720px;
  position: relative;
  z-index: 1;
`;

const StyledCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const StyledSideImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('${doctorImage}');
  min-height: 443px;
`;

const StyledBackgrounImage = styled.div`
  background-image: url('${doctorsImage}');
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-repeat: no-repeat;
`;

const StyledBackgroundGradient = styled(StyledBackgrounImage)`
  background: linear-gradient(
    transparent,
    ${({ theme }) => theme.palette.primary2.main}
  );
`;
