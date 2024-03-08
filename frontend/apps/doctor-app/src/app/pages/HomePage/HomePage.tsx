import { Flex } from '@local/shared-components';
import { CallHistoryTable } from './CallHistoryTable/CallHistoryTable';
import { Statistics } from './Statistics';
import { ProfilePreview } from './ProfilePreview';
import { useSearchCallLogs } from '../../api/callLogs';
import { useState } from 'react';
import { SearchPageParams } from '@local/api-generated';

export function HomePage() {
  const [searchParams, setSearchParams] = useState<SearchPageParams>({
    page: 1,
    size: 10,
  });
  const { data } = useSearchCallLogs(searchParams);

  const onPageChange = (page: number, size: number) =>
    setSearchParams({ page, size });

  return (
    <Flex smDirection="column" fullWidth flexWrap="nowrap" align="stretch">
      <ProfilePreview />
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
