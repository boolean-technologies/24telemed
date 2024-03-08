import { FrownOutlined, FieldTimeOutlined, CustomerServiceOutlined, HourglassOutlined } from '@ant-design/icons';
import { Statistic } from 'antd';
import { Flex, Card } from '@local/shared-components';
import styled from 'styled-components';

export function Statistics() {
  return (
    <Card>
    <Flex justify="space-between" direction="column" fullWidth>
      <Flex smDirection="column">
        <StyledStatCard align="center" justify="center">
          <Statistic
            title="Total Call Time"
            value={11.28}
            precision={2}
            prefix={<FieldTimeOutlined />}
            suffix="hrs"
          />
        </StyledStatCard>
        <StyledStatCard align="center" justify="center">
          <Statistic
            title="Total Completed"
            value={254}
            prefix={<CustomerServiceOutlined />}
          />
        </StyledStatCard>
      </Flex>
      <Flex smDirection="column">
        <StyledStatCard align="center" justify="center">
          <Statistic
            title="Total Busy"
            value={250}
            prefix={<HourglassOutlined />}
          />
        </StyledStatCard>
        <StyledStatCard align="center" justify="center">
          <Statistic
            title="Total Failed"
            value={23}
            prefix={<FrownOutlined />}
          />
        </StyledStatCard>
      </Flex>
    </Flex>
    </Card>
  );
}

const StyledStatCard = styled(Flex)`
  flex: 1;
  width: 100%;
  min-height: 120px;
  border: ${({ theme }) => theme.border.primary.light};
  border-radius: 8px;
  .ant-statistic {
    width: max-content;
    text-align: center;
  }
  .ant-statistic-content {
    font-weight: bold;
    color: ${({ theme }) => theme.palette.primary1.main};
  }
`;
