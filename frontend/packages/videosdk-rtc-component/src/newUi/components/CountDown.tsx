import { Statistic, CountdownProps } from 'antd';
import { useRef } from 'react';

export const CallCountDown = () => {
  const callTime = useRef(Date.now() + 1000 * 60 * 30);
  const formatter: CountdownProps['formatter'] = (value) => {
    const minutes = Math.floor(value as number / 1000 / 60);
    const seconds = Math.floor((value as number / 1000) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };
  return (
    <Statistic.Countdown
      value={callTime.current}
      formatter={formatter}
      valueStyle={{
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  );
};
