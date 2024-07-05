import { Flex } from '@local/shared-components';
import { CallHistoryBox } from '../../components/CallHistoryBox';

export function CallHistoryPage() {
  return (
    <Flex direction="column" padding="md" fullHeight fullWidth>
      <CallHistoryBox />
    </Flex>
  );
}
