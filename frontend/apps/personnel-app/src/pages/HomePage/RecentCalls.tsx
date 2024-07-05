import {
  Flex,
  IonIcon,
  Typography,
} from '@local/shared-components';
import { Button, Divider } from 'antd';
import styled from 'styled-components';
import { CallHistoryBox } from '../../components/CallHistoryBox';
import { Link } from 'react-router-dom';
import { Path } from '../../constants';

const RecentCalls = () => {
  return (
    <Flex direction="column" fullWidth fullHeight>
      <Divider style={{ margin: 0 }} />
      <Flex justify="space-between">
        <Typography variant="bodyLg">Recent Calls</Typography>
        <Link to={Path.history}>
          <Button icon={<IonIcon name="list" size="md" />} />
        </Link>
      </Flex>
      <Divider style={{ margin: 0 }} />
      <CallHistoryBox recent />
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
