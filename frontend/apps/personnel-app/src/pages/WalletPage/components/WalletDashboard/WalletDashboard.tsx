import { Flex } from 'antd';
import { WalletBalance } from './components/WalletBalance';
import { TransactionHistory } from './components/TransactionHistory';
import { Outlet } from 'react-router-dom';

export function WalletDashboard() {
  return (
    <Flex vertical gap={16}>
      <WalletBalance />
      <TransactionHistory />
      <Outlet />
    </Flex>
  );
}
