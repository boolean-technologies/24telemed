import { Tag, type TagProps } from 'antd';
import { CallLog } from '@local/api-generated';

type CallStatusProps = {
  status: CallLog.status;
};

export function CallStatus({ status }: CallStatusProps) {
  const colorStatus: Record<CallLog.status, TagProps['color']> = {
    [CallLog.status.INITIATED]: "blue",
    [CallLog.status.BUSY]: "error",
    [CallLog.status.DECLINED]: "error",
    [CallLog.status.FAILED]: 'error',
    [CallLog.status.IN_PROGRESS]: "orange",
    [CallLog.status.COMPLETED]: "success",
  };
  return (
    <Tag color={colorStatus[status] || 'error'} style={{ fontWeight: 'bold' }}>
      {status}
    </Tag>
  );
}
