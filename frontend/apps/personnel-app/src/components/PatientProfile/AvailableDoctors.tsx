import { Flex, MessageResult } from '@local/shared-components';
import DoctorInfoComponent from './DoctorInfo';
import { usePersonnelCommunication } from '@local/websocket';
import { List } from 'antd-mobile';
import { Typography as AntTypography, Space } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

type AvailableDoctorsProps = {
  patientId: string;
};

const AvailableDoctors = ({ patientId }: AvailableDoctorsProps) => {
  const { availableDoctors = [] } = usePersonnelCommunication();

  return (
    <Flex direction="column" fullWidth fullHeight>
      
      <Flex
        direction="column"
        gap="sm"
        fullWidth
        fullHeight
        align="center"
        justify="center"
      >
        {availableDoctors.length ? (
          <List style={{ width: '100%' }}>
            {availableDoctors.map((doctorId) => (
              <List.Item key={doctorId}>
                <DoctorInfoComponent
                  key={doctorId}
                  id={doctorId}
                  patientId={patientId}
                />
              </List.Item>
            ))}
          </List>
        ) : (
          <Flex padding="xl" direction="column" align="center">
            <MessageResult
              icon="alert-circle"
              title="Contact Clinical Coordinator"
              subTitle={
                <ContactContainer direction="column" align="center">
                  <StyledSpace>
                    <span>
                      <PhoneOutlined />
                    </span>
                    <Link to="tel:08130790883">
                      <AntTypography.Text copyable strong>
                        08130790883
                      </AntTypography.Text>
                    </Link>
                  </StyledSpace>
                  <StyledSpace>
                    <span>
                      <PhoneOutlined />
                    </span>
                    <Link to="tel:07088561710">
                      <AntTypography.Text copyable strong>
                        07088561710
                      </AntTypography.Text>
                    </Link>
                  </StyledSpace>
                </ContactContainer>
              }
              status="warning"
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AvailableDoctors;

const StyledSpace = styled(Space)`
  ${({ theme }) => theme.typography.bodySm}
`;

const ContactContainer = styled(Flex)`
  gap: ${({ theme }) => theme.spacing.md};
`;
