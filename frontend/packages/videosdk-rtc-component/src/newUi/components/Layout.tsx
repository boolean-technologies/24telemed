import { Layout } from 'antd';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { BottomBar } from './BottomBar';
import { Flex } from '@local/shared-components';
import { TopBar } from './TopBar';
import { StreamArea, StreamAreaProps } from './StreamArea';

type AppLayoutProps = {
  children: ReactNode;
};
export function AppLayout({ children }: AppLayoutProps) {
  const [sideView, setSideView] = useState<StreamAreaProps['sideView']>();

  return (
    <StyledRoot>
      <Flex direction="column" flex={1} gap="none">
        <TopBar />
        <StyledContent flex={1}>
          <StreamArea
            sideView={sideView}
            onClose={() => setSideView(undefined)}
          />
        </StyledContent>
        <BottomBar
          currentView={sideView}
          onMenuClick={() =>
            setSideView(sideView === 'menu' ? undefined : 'menu')
          }
          onChatClick={() =>
            setSideView(sideView === 'chats' ? undefined : 'chats')
          }
          onParticipantClick={() =>
            setSideView(
              sideView === 'participants' ? undefined : 'participants'
            )
          }
        />
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Layout)`
  height: 100vh;
  width: 100wv;
  background: ${({ theme }) => theme.palette.primary1.main};
`;

const StyledContent = styled(Flex)`
  padding-left: ${({ theme }) => theme.spacing.md};
  padding-right: ${({ theme }) => theme.spacing.md};
`;
