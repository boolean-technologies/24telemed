import { FrownOutlined, FieldTimeOutlined, CustomerServiceOutlined, HourglassOutlined } from '@ant-design/icons';
import { Statistic } from 'antd';
import { Flex, Card } from '@local/shared-components';
import styled from 'styled-components';
import { CallStats } from '@local/api-generated';
import { useGetCallLogStats } from '../../../api/callLogs';



export function Statistics() {

  const { data: stats } = useGetCallLogStats({
    page: 1,
    size: 10
  });


  return (
    <Card>
    <Flex justify="space-between" direction="column" fullWidth>
      <Flex smDirection="column">
        <StyledStatCard align="center" justify="center">
          <Statistic
            title="Total Call Time"
            value={stats?.total_call_time || 0}
            precision={2}
            prefix={<FieldTimeOutlined />}
            suffix="hrs"
          />
        </StyledStatCard>
        <StyledStatCard align="center" justify="center">
          <Statistic
            title="Total Completed"
            value={stats?.total_completed || 0}
            prefix={<CustomerServiceOutlined />}
          />
        </StyledStatCard>
      </Flex>
      <Flex smDirection="column">
        <StyledStatCard align="center" justify="center">
          <Statistic
            title="Total Busy"
            value={stats?.total_busy || 0}
            prefix={<HourglassOutlined />}
          />
        </StyledStatCard>
        <StyledStatCard align="center" justify="center">
          <Statistic
            title="Total Failed"
            value={stats?.total_failed || 0}
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
