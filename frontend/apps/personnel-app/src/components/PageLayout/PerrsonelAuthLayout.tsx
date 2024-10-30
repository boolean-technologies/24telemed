import { Layout, Button as AntButton } from 'antd';
import { Card, Flex, Typography } from '@local/shared-components';
import styled from 'styled-components';
import { Button } from 'antd-mobile';
import {  PatientImage } from '../../assets';



interface AuthLayoutProps {
  children: React.ReactNode;
  sideImage?: boolean;
}

export function PersonnelAuthLayout({ children, sideImage }: AuthLayoutProps) {
  return (
    <StyledRoot>
      <Flex fullHeight fullWidth align="center" justify="center">
        <StyledLoginBox>
          <StyledCard>
            <Flex gap="none" fullHeight align="stretch">
              {sideImage && (
                <StyledImageSection>
                  <StyledSideImage />
                  <StyledImageContent>
                    <Typography variant='h5' color="common.white">
                    We Care
                    </Typography>
                    <Typography color="common.white" marginBottom="md">
                    Delivering quality healthcare with compassion and excellence.
                    </Typography>
                    <AntButton
                     href="https://24telemedcharity.org/"
                      block
                      target='_blank'
                      
                    >
                      Support Us
                    </AntButton>
                  </StyledImageContent>
                </StyledImageSection>
              )}
              <Flex fullHeight fullWidth padding="md">
                {children}
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
  max-width: 1000px;
  position: relative;
  z-index: 1;
`;

const StyledCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const StyledImageSection = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledSideImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('${PatientImage}');
  min-height: 443px;
`;

const StyledImageContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  text-align: center;

  
  &:hover {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  }
`;

const StyledBackgrounImage = styled.div`
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