import { Tag, type TagProps } from 'antd';
import { CallLog } from '@local/api-generated';

type CallPriorityProps = {
  priority?: CallLog.priority;
};

export function CallPriority({ priority }: CallPriorityProps) {
  const colorStatus: Record<CallLog.priority, {
    color: TagProps['color'];
    label: string;
  }> = {
    [CallLog.priority._1]: {
        color: "green",
        label: "Low"
    },
    [CallLog.priority._2]: {
        color: "blue",
        label: "Medium"
    },
    [CallLog.priority._3]: {
        color: "orange",
        label: "High"
    },
    [CallLog.priority._4]: {
        color: "red",
        label: "Critical"
    },
  };

  if (!priority) return null;

  return (
    <Tag color={colorStatus[priority].color || 'error'} style={{ fontWeight: 'bold' }}>
      {colorStatus[priority].label}
    </Tag>
  );
}
