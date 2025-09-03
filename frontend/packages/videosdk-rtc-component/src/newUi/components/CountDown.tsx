import { Statistic, CountdownProps } from 'antd';
import { useRef } from 'react';

type CallCountDownProps = {
  callTime: Date;
  callDurationLimit: number;
};

export const CallCountDown = ({
  callTime,
  callDurationLimit,
}: CallCountDownProps) => {
  const formatter: CountdownProps['formatter'] = (value) => {
    const minutes = Math.floor((value as number) / 1000 / 60);
    const seconds = Math.floor(((value as number) / 1000) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };
  return (
    <Statistic.Countdown
      value={callTime.getTime() + callDurationLimit * 60 * 1000}
      formatter={formatter}
      valueStyle={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1rem',
      }}
    />
  );
};
