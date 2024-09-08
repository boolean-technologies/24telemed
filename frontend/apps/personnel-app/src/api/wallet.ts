import { useInfiniteQuery } from '@tanstack/react-query';
import {
  ApiError,
  SearchResultType,
  Transaction,
  WalletService,
} from '@local/api-generated';
import { getQueryParam } from '../utils/getQueryParam';

type SearchType = {
  page?: number;
  size?: number;
};

export const useWalletTransactions = (params: SearchType) =>
  useInfiniteQuery<SearchResultType<Transaction>, ApiError>({
    initialPageParam: 1,
    queryKey: ['walletTransactions', params],
    queryFn: ({ pageParam = 1 }) =>
      WalletService.walletTransactionsList(pageParam as number, params.size),
    getNextPageParam: (lastPage) =>
      lastPage.next
        ? Number(getQueryParam(lastPage.next, "page"))
        : undefined,
  });
