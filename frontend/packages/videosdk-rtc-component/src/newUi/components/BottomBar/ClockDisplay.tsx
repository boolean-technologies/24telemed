import { Typography } from '@local/shared-components';
import { useClock } from '../../hooks/useClock';

export function ClockDisplay() {
  const clock = useClock();
  return (
    <Typography color="common.white" weight="bold">
      {clock}
    </Typography>
  );
}
