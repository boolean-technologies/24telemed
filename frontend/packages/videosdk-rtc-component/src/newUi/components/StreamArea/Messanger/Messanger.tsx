import { Flex, MessageResult } from '@local/shared-components';
import { MessageItem } from './MessageItem';
import styled from 'styled-components';
import { MessageForm } from './MessageForm';
import { usePubSub } from '@videosdk.live/react-sdk';
import { useEffect, useRef } from 'react';

export function Messanger() {
  const { messages } = usePubSub('CHAT');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Flex direction="column" gap="none" fullHeight fullWidth>
      {messages?.length ? (
        <MessagesArea flex={1}>
          <MessagesAreaContainer
            direction="column"
            padding="sm"
            gap="lg"
            flex={1}
            fullWidth
          >
            {messages.map((message) => (
              <MessageItem key={message.id} {...message} />
            ))}
            <div ref={messagesEndRef} />
          </MessagesAreaContainer>
        </MessagesArea>
      ) : (
        <MessageResult
          icon="chatbubbles"
          title="No Chat Available"
          subTitle="Send your first message by typing your message and clicking the send button below."
        />
      )}

      <MessageForm />
    </Flex>
  );
}

const MessagesArea = styled(Flex)`
  position: relative;
`;

const MessagesAreaContainer = styled(Flex)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
`;
