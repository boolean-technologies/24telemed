import { Tag } from 'antd';
import { ConsultationStatus } from '../api/partners';

const LABELS: Record<ConsultationStatus, { color: string; label: string }> = {
  pending_payment: { color: 'orange', label: 'Awaiting payment' },
  paid: { color: 'green', label: 'Paid · ready' },
  completed: { color: 'default', label: 'Completed' },
  cancelled: { color: 'red', label: 'Cancelled' },
};

export function ConsultationStatusTag({ status }: { status: ConsultationStatus }) {
  const { color, label } = LABELS[status] ?? LABELS.pending_payment;
  return <Tag color={color}>{label}</Tag>;
}
