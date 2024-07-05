import { flatMap, groupBy } from 'lodash-es';
import { useSearchCallLogs } from '../api/callLogs';
import { FullCallLog, SearchResultType } from '@local/api-generated';
import { DateTime } from 'luxon';
import { isToday, isYesterday, format } from 'date-fns';
import {
  Card,
  Flex,
  MessageResult,
  Typography,
} from '@local/shared-components';
import { InfiniteScroll, List } from 'antd-mobile';
import { CallHistoryItem } from './CallHistoryItem';

type CallHistoryBoxProps = {
    recent?: boolean;
}

export function CallHistoryBox({ recent }: CallHistoryBoxProps) {
  const { data, fetchNextPage, hasNextPage } = useSearchCallLogs(recent ? { page: 1, size: 8 } : { });

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
    <>
      {callLogs.length ? (
        Object.keys(groupedCalls).map((date: string) => (
          <Flex direction="column" key={date}>
            <Typography weight="bold" color="primary1.light">{formatGroupDate(date)}</Typography>
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
          <MessageResult
            icon="list-circle"
            title="No Call History"
            subTitle="Your call log is currently empty. Make your first call today or check back later to see your call history here."
          />
        </Flex>
      )}
      {hasNextPage && !recent && (
        <InfiniteScroll loadMore={handleLoadMore} hasMore>
          Loading...
        </InfiniteScroll>
      )}
    </>
  );
}
