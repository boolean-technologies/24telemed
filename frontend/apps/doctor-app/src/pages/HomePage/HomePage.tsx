import { Flex, PageLoading } from '@local/shared-components';
import { CallHistoryTable } from './CallHistoryTable/CallHistoryTable';
import { Statistics } from './Statistics';
import { ProfilePreview } from './ProfilePreview';
import { useSearchCallLogs } from '../../api/callLogs';
import { useState } from 'react';
import { SearchPageParams } from '@local/api-generated';
import { useGetCurrentUser } from '../../api/personnels';

export function HomePage() {
  const [searchParams, setSearchParams] = useState<SearchPageParams>({
    page: 1,
    size: 5,
  });
  const { data } = useSearchCallLogs(searchParams);
  const { data: user, isLoading } = useGetCurrentUser();

  const onPageChange = (page: number, size: number) =>
    setSearchParams({ page, size });
  if (!user || isLoading) return <PageLoading />;

  return (
    <Flex smDirection="column" fullWidth flexWrap="nowrap" align="stretch">
      <ProfilePreview user={user} />
      <Flex direction="column" fullWidth fullHeight>
        <Statistics />
        <CallHistoryTable
          tableData={data}
          searchParams={searchParams}
          onPageChange={onPageChange}
        />
      </Flex>
    </Flex>
  );
}
