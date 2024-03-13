import { Tag, type TagProps } from 'antd';
import { FullCallLog } from '@local/api-generated';

type CallPriorityProps = {
  priority?: FullCallLog.priority;
};

export function CallPriority({ priority }: CallPriorityProps) {
  const colorStatus: Record<FullCallLog.priority, {
    color: TagProps['color'];
    label: string;
  }> = {
    [FullCallLog.priority._1]: {
        color: "green",
        label: "Low"
    },
    [FullCallLog.priority._2]: {
        color: "blue",
        label: "Medium"
    },
    [FullCallLog.priority._3]: {
        color: "orange",
        label: "High"
    },
    [FullCallLog.priority._4]: {
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
