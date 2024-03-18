import { Flex, Typography } from '@local/shared-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useMeeting } from '@videosdk.live/react-sdk';

type MessageItemProps = {
  id: string;
  message: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  topic: string;
  payload: object;
};

export function MessageItem({
  message,
  senderName,
  senderId,
  payload,
}: MessageItemProps) {
  const { localParticipant } = useMeeting();
  
  return (
    <Flex align="flex-start">
      <div>
        <Avatar shape="square" size={45} icon={<UserOutlined />} />
      </div>
      <Flex direction="column" gap="xxs">
        <Flex gap="xs">
          <Typography weight="bold" color="common.white">
            {localParticipant?.id === senderId ? 'You' : senderName}
          </Typography>
          <Typography color="primary1.lighter">12:42pm</Typography>
        </Flex>
        <Typography color="primary1.lighter">{message}</Typography>
      </Flex>
    </Flex>
  );
}
