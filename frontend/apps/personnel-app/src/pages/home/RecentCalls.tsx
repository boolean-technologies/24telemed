import {
  ArrowDown,
  ClockIcon,
  Flex,
  Typography,
} from '@local/shared-components';
import { Card } from 'antd';
import React from 'react';
import styled from 'styled-components';

const RecentCalls = () => {
  return (
    <Flex direction="column" fullWidth fullHeight>
      <Typography variant="bodyLg">Recent Calls</Typography>
      <Card>
        <Flex direction="column" fullWidth fullHeight>
          <Typography variant="bodyMd">Today </Typography>
          <Call direction="row" fullWidth fullHeight justify="space-between">
            <Flex direction="row" gap="sm" padding="sm">
              <ArrowDown />
              <Flex direction="column" gap="none">
                <Typography variant="bodyMd"> Dr Rotimi Adebayo </Typography>
                <Typography variant="bodyXs">
                  Patient 081******8 (Ademola)
                </Typography>
              </Flex>
            </Flex>
            <Flex direction="row" gap="none">
              <ClockIcon /> <Typography variant="bodyXs"> 12:30 PM </Typography>
            </Flex>
          </Call>
        </Flex>
      </Card>
    </Flex>
  );
};

export default RecentCalls;

const Call = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.neutral.main};
  border-radius: 4px;
  padding-left: ${({ theme }) => theme.spacing.sm};
  padding-right: ${({ theme }) => theme.spacing.sm};
`;
