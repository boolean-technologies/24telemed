import { Layout } from 'antd';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { BottomBar } from './BottomBar';
import { Flex } from '@local/shared-components';
import { StreamArea, StreamAreaProps } from './StreamArea';
import { NoteType } from './StreamArea/MedicalNote/types';
import { useMedicalNoteSections } from './StreamArea/MedicalNote/useMedicalNoteSections';

type AppLayoutProps = {
  children: ReactNode;
  meetingTitle: string;
};
export function AppLayout({ children, meetingTitle }: AppLayoutProps) {
  const [sideView, setSideView] = useState<StreamAreaProps['sideView']>();
  const [activeNoteSection, setActiveNoteSection] =
    useState<NoteType>('reason_for_visit');
  const medicalNoteSections = useMedicalNoteSections(activeNoteSection);

  return (
    <StyledRoot>
      <Flex direction="column" flex={1} gap="md" padding="md" fullWidth>
        <Flex flex={1}>
          <StreamArea
            sideView={sideView}
            onClose={() => setSideView(undefined)}
            activeNoteSection={activeNoteSection}
            setActiveNoteSection={setActiveNoteSection}
            medicalNoteSections={medicalNoteSections}
          />
        </Flex>
        <BottomBar
          hasNoteNotification={Boolean(
            medicalNoteSections.find((e) => e.hasNotication)
          )}
          meetingTitle={meetingTitle}
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
  justify-content: center;
  align-items: center;
`;
