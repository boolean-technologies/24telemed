import { PlusOutlined } from '@ant-design/icons';
import { useCurrentUser } from '@local/api-generated';
import { Button, Card, Flex, Statistic, Tag, Typography } from 'antd';
import { DateTime } from 'luxon';
import { formatToNaira } from '../../../../../utils/formatToNaira';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export function WalletBalance() {
  const { data: user } = useCurrentUser();
  const callSession = user?.wallet?.call_session ?? 0;

  return (
    <StyledRoot
      bordered={false}
      actions={
        user?.wallet?.updated_at
          ? [
              <Typography
                key="info"
                style={{ color: '#e0e0e0', textAlign: 'left', paddingLeft: 24 }}
              >
                Last updated at{' '}
                <strong>
                  {DateTime.fromISO(user.wallet.updated_at).toFormat(
                    'yyyy LLL dd @ HH:mma'
                  )}
                </strong>
              </Typography>,
            ]
          : undefined
      }
    >
      <Flex align="center" justify="space-between">
        <Flex vertical>
          <StyledStatistic
            title="Total balance"
            value={formatToNaira(user?.wallet?.balance ?? 0)}
          />
          <Tag color={callSession < 1 ? 'red' : 'green'}>
            {callSession} call sessions
          </Tag>
        </Flex>
        <Link to="fund">
          <Button icon={<PlusOutlined />} shape="circle" />
        </Link>
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Card)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.primary1.main},
    ${({ theme }) => theme.palette.primary2.main}
  ) !important;
  .ant-card-actions {
    background: transparent;
    border-top: 1px solid ${({ theme }) => theme.palette.primary2.main};
  }
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title,
  .ant-statistic-content-value {
    color: ${({ theme }) => theme.palette.common.white};
  }
  .ant-statistic-content-value {
    font-weight: bold;
  }
`;
