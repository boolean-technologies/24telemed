import { Result } from 'antd';
import { Flex } from '../Flex';
import { Typography } from '../Typography';
import { IonIcon } from '../IonIcon';
import { ReactNode } from 'react';

type MessageResultProps = {
  title: string;
  subTitle?: ReactNode;
  icon: string;
  extra?: ReactNode;
  status?: 'success' | 'error' | 'info' | 'warning';
};

export function MessageResult({ title, subTitle, icon, extra, status }: MessageResultProps) {
  return (
    <Flex fullHeight fullWidth justify="center" align="center">
      <Result
        status={status}
        icon={<IonIcon name={icon} size={80} color="primary1.lighter" />}
        title={
          <Typography
            variant="bodyLg"
            align="center"
            weight="bold"
            color="primary1.lighter"
          >
            {title}
          </Typography>
        }
        subTitle={
          subTitle ? (
            <Typography align="center" color="primary1.lighter">
              {subTitle}
            </Typography>
          ) : undefined
        }
        extra={extra}
      />
    </Flex>
  );
}
