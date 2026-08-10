import { useQuery } from '@tanstack/react-query';
import { WalletService } from '@/api';

export function useWalletTransactions(page = 1, size = 20) {
  return useQuery({
    queryKey: ['wallet', 'transactions', page, size],
    queryFn: () => WalletService.walletTransactionsList(page, size),
  });
}
