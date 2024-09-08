import { PhoneFilled, CreditCardFilled } from '@ant-design/icons';
import { MessageResult } from '@local/shared-components';
import { Avatar, Card, List, Tag } from 'antd';
import { formatToNaira } from '../../../../../utils/formatToNaira';
import { useWalletTransactions } from '../../../../../api/wallet';
import { InfiniteScroll } from 'antd-mobile';
import { flatMap } from 'lodash-es';
import { SearchResultType, Transaction } from '@local/api-generated';
import { DateTime } from 'luxon';

export function TransactionHistory() {
  const { data, fetchNextPage, hasNextPage } = useWalletTransactions({});

  const transactions = flatMap(
    data?.pages,
    (page: SearchResultType<Transaction>) => page.results
  ) as unknown as Transaction[];

  const handleLoadMore = async () => {
    await fetchNextPage();
  };

  return (
    <Card bordered={false} title="Transactions" style={{ boxShadow: 'none'}}>
      <List
        itemLayout="horizontal"
        dataSource={transactions}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    item.transaction_type === 'deposit' ? (
                      <CreditCardFilled />
                    ) : (
                      <PhoneFilled />
                    )
                  }
                />
              }
              title={item.description}
              description={
                <div>
                  {DateTime.fromISO(item.created_at!).toFormat('dd LLL yyyy @ HH:mma')}
                  {" • "}
                  {item.transaction_type === 'deposit'
                    ? 'Wallet topup'
                    : 'Call charge'}
                </div>
              }
            />
            <Tag
              color={item.transaction_type === 'deposit' ? 'success' : 'error'}
            >
              {formatToNaira(item.amount ?? 0)}
            </Tag>
          </List.Item>
        )}
        locale={{
          emptyText: (
            <MessageResult
              icon="wallet"
              title="No Transactions Yet"
              subTitle="You haven't made any transactions yet. Once you start using your wallet, your transaction history will appear here."
            />
          ),
        }}
      />
      {hasNextPage && (
        <InfiniteScroll loadMore={handleLoadMore} hasMore>
          Loading...
        </InfiniteScroll>
      )}
    </Card>
  );
}
