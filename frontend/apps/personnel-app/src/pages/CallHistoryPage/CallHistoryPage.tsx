import { DateTime } from 'luxon';
import { flatMap, groupBy } from 'lodash-es';
import { isToday, isYesterday, format } from 'date-fns';
import { Card, Flex, IonIcon, Typography } from '@local/shared-components';
import { InfiniteScroll, List } from 'antd-mobile';
import { CallHistoryItem } from './CallHistoryItem';
import { useSearchCallLogs } from '../../api/callLogs';
import { FullCallLog, SearchResultType } from '@local/api-generated';

export function CallHistoryPage() {
  const { data, fetchNextPage, hasNextPage } = useSearchCallLogs({});

  const callLogs = (
    flatMap(
      data?.pages,
      (page: SearchResultType<FullCallLog>) => page.results
    ) as unknown as FullCallLog[]
  ).map((call) => ({
    ...call,
    groupDate: DateTime.fromISO(call.created_at!).toISODate(),
  }));

  const groupedCalls = groupBy(callLogs, 'groupDate');

  const formatGroupDate = (date: string) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM dd, yyyy');
  };

  const handleLoadMore = async () => {
    await fetchNextPage();
  };

  return (
    <Flex direction="column" padding="md" fullHeight>
      {callLogs.length ? (
        Object.keys(groupedCalls).map((date: string) => (
          <Flex direction="column">
            <Typography weight="bold">{formatGroupDate(date)}</Typography>
            <Card padding="none">
              <List mode="card" style={{ margin: 0 }}>
                {groupedCalls[date].map((callLog: FullCallLog) => (
                  <List.Item key={callLog.id}>
                    <CallHistoryItem callLog={callLog} />
                  </List.Item>
                ))}
              </List>
            </Card>
          </Flex>
        ))
      ) : (
        <Flex fullHeight fullWidth>
          <Card fullHeight>
            <Flex
              direction="column"
              align="center"
              justify="center"
              padding="xl"
              fullHeight
              fullWidth
            >
              <IonIcon name="list-circle" size={100} color="primary2.main" />
              <Typography variant="h3" align="center">
                No Call History
              </Typography>
              <Typography variant="bodyLg" align="center">
                Your call log is currently empty. Make your first call today or
                check back later to see your call history here.
              </Typography>
            </Flex>
          </Card>
        </Flex>
      )}
      {hasNextPage && (
        <InfiniteScroll loadMore={handleLoadMore} hasMore>
          Loading...
        </InfiniteScroll>
      )}
    </Flex>
  );
}
