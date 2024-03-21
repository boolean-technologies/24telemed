import { Result } from 'antd';
import { Flex } from '../Flex';
import { Typography } from '../Typography';
import { IonIcon } from '../IonIcon';

type MessageResultProps = {
  title: string;
  subTitle?: string;
  icon: string;
};

export function MessageResult({ title, subTitle, icon }: MessageResultProps) {
  return (
    <Flex fullHeight fullWidth justify="center" align="center">
      <Result
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
      />
    </Flex>
  );
}
