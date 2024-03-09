import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';
import { Flex, Typography } from '@local/shared-components';
import { FullCallLog } from '@local/api-generated';

type PatientNameProps = {
  data: FullCallLog;
};

export function PatientName({ data }: PatientNameProps) {
  return (
    <Flex align="center">
        <StyledIconWrapper align="center" justify="center">
            <UserOutlined />
        </StyledIconWrapper>
      <Flex direction="column" gap="none">
        <Typography weight="bold">
        {data.health_care_assistant.first_name}{" "}
        {data.health_care_assistant.last_name}
        </Typography>
        <Typography variant="bodyXs" color="primary1.light">
          @{data.health_care_assistant.username}
        </Typography>
      </Flex>
    </Flex>
  );
}

const StyledIconWrapper = styled(Flex)`
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: ${({ theme }) => theme.border.primary.main};
`;