import { DateTime } from 'luxon';
import { Table, type TableColumnsType } from 'antd';
import { CallStatus } from './CallStatus';
import { FullCallLog, SearchPageParams, SearchResultType } from '@local/api-generated';
import { PatientName } from './PatientName';
import { Card } from '@local/shared-components';
import styled from 'styled-components';

type CallHistoryTableProps = {
  tableData?: SearchResultType<FullCallLog>;
  searchParams: SearchPageParams;
  onPageChange: (page: number, pageSize: number) => void;
};

export function CallHistoryTable({ tableData, searchParams, onPageChange }: CallHistoryTableProps) {
  const columns: TableColumnsType<FullCallLog> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, data) => <PatientName data={data} />,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      render: (value) => DateTime.fromISO(value).toFormat('ccc dd, yyyy'),
    },
    {
      title: 'Time',
      dataIndex: 'created_at',
      key: 'time',
      render: (value) => DateTime.fromISO(value).toFormat('hh:mm a'),
    },
    {
      title: 'Duration',
      dataIndex: 'created_at',
      key: 'time',
      render: (_, record) => {
        const dateTime1 = DateTime.fromISO(record.start_time);
        const dateTime2 = DateTime.fromISO(record.end_time || record.start_time);
        const diff = dateTime2.diff(dateTime1, 'minutes');
        const minutes = diff.minutes;
        return `${Math.round(minutes)} min`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <CallStatus status={value} />,
    },
  ];

  return (
    <StyledRoot title="Call history" subtitle="Medical consultation history">
      <Table
        dataSource={tableData?.results || []}
        columns={columns}
        pagination={{
          total: tableData?.count,
          pageSize: searchParams.size,
          current: searchParams.page,
          onChange: onPageChange,
          pageSizeOptions: [5, 10, 15, 25, 50],
        }}
        style={{ minHeight: 500 }}
      />
    </StyledRoot>
  );
}

const StyledRoot = styled(Card)`
  min-height: 100%;
  flex: 1;
`;
