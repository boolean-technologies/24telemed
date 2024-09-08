import { Flex } from 'antd';
import { WalletDashboard } from './components/WalletDashboard';

export function WalletPage() {
  return (
    <Flex vertical style={{ padding: 24 }}>
      <WalletDashboard />
    </Flex>
  );
}
