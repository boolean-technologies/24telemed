import { Tag, type TagProps } from 'antd';
import { FullCallLog } from '@local/api-generated';

type CallStatusProps = {
  status: FullCallLog.status;
  padding?: number;
};

export function CallStatus({ status, padding }: CallStatusProps) {
  const colorStatus: Record<FullCallLog.status, TagProps['color']> = {
    [FullCallLog.status.INITIATED]: "blue",
    [FullCallLog.status.BUSY]: "error",
    [FullCallLog.status.DECLINED]: "error",
    [FullCallLog.status.FAILED]: 'error',
    [FullCallLog.status.IN_PROGRESS]: "orange",
    [FullCallLog.status.COMPLETED]: "success",
  };
  return (
    <Tag color={colorStatus[status] || 'error'} style={{ fontWeight: 'bold', textAlign: "center", padding }}>
      {status}
    </Tag>
  );
}
