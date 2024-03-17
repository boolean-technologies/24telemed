import { Layout } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { BottomBar } from './BottomBar';
import { Flex } from '@local/shared-components';
import { StreamArea, StreamAreaProps } from './StreamArea';
import { NoteType } from './StreamArea/MedicalNote/types';
import { useMedicalNoteSections } from './StreamArea/MedicalNote/useMedicalNoteSections';

type AppMainProps = {
  meetingTitle: string;
};
export function AppMain({ meetingTitle }: AppMainProps) {
  const [sideView, setSideView] = useState<StreamAreaProps['sideView']>();
  const [activeNoteSection, setActiveNoteSection] =
    useState<NoteType>('reason_for_visit');
  const medicalNoteSections = useMedicalNoteSections(activeNoteSection);

  const onBottomButtonClick = (view: StreamAreaProps['sideView']) =>
    setSideView(sideView === view ? undefined : view);

  const hasBottomNotification = Boolean(
    medicalNoteSections.find((e) => e.hasNotication)
  );

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
          currentView={sideView}
          meetingTitle={meetingTitle}
          hasNoteNotification={hasBottomNotification}
          onChatClick={() => onBottomButtonClick('chats')}
          onMedicationButtonClick={() => onBottomButtonClick('medication')}
          onMedicalNoteButtonClick={() => onBottomButtonClick('medicalNotes')}
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
