import { Layout, Statistic, CountdownProps} from 'antd';
import { Popup } from 'antd-mobile';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { BottomBar, BottomBarMobile, TopCallTools } from './BottomBar';
import {
  Flex,
  addAlpha,
  useBreakpoints,
} from '@local/shared-components';
import { StreamArea, StreamAreaProps } from './StreamArea';
import { NoteType } from './StreamArea/MedicalNote/types';
import { useMedicalNoteSections } from './StreamArea/MedicalNote/useMedicalNoteSections';


type AppMainProps = {
  meetingTitle: string;
  defaultSideView?: StreamAreaProps['sideView'];
};
export function AppMain({ meetingTitle, defaultSideView }: AppMainProps) {
  const { isMobile } = useBreakpoints();
  const [sideView, setSideView] =
    useState<StreamAreaProps['sideView']>(defaultSideView);
  const [activeNoteSection, setActiveNoteSection] =
    useState<NoteType>('reason_for_visit');
  const medicalNoteSections = useMedicalNoteSections(activeNoteSection);

  const onBottomButtonClick = (view: StreamAreaProps['sideView']) => {
    setSideView(sideView === view ? undefined : view);
  };

  const hasBottomNotification = Boolean(
    medicalNoteSections.find((e) => e.hasNotication)
  );

  const callTime = useRef(Date.now() + 1000 * 60 * 30);
  const formatter: CountdownProps['formatter'] = (value) => {
    // @ts-ignore
    const minutes = Math.floor(value / 1000 / 60);
    // @ts-ignore
    const seconds = Math.floor((value / 1000) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StyledRoot>
      <Flex
        direction="column"
        flex={1}
        gap="md"
        padding="md"
        smPadding="none"
        fullWidth
      >
        <Flex flex={1}>
          
          <StreamArea
            sideView={sideView}
            onClose={() => setSideView(undefined)}
            activeNoteSection={activeNoteSection}
            setActiveNoteSection={setActiveNoteSection}
            medicalNoteSections={medicalNoteSections}
          />
        </Flex>
         <Statistic.Countdown
        value={callTime.current}
        formatter={formatter}
        valueStyle={
          {
            color: 'white',
            fontWeight: 'bold'
          }
        }
      />
        {isMobile ? (
          <>

            <StyledPopup
              visible
              bodyStyle={{ overflow: 'scroll' }}
              mask={false}
            >

              <BottomBarMobile
                currentView={sideView}
                meetingTitle={meetingTitle}
                onChatClick={() => onBottomButtonClick('chats')}
              />
            </StyledPopup>
            
            <TopCallTools
              currentView={sideView}
              hasNoteNotification={hasBottomNotification}
              onChatClick={() => onBottomButtonClick('chats')}
              onMedicationButtonClick={() => onBottomButtonClick('medication')}
              onMedicalNoteButtonClick={() =>
                onBottomButtonClick('medicalNotes')
              }
              onPatientProfileButtonClick={() =>
                onBottomButtonClick('patientProfile')
              }
            />
            
          </>
        ) : (
          <BottomBar
            currentView={sideView}
            meetingTitle={meetingTitle}
            hasNoteNotification={hasBottomNotification}
            onChatClick={() => onBottomButtonClick('chats')}
            onMedicationButtonClick={() => onBottomButtonClick('medication')}
            onMedicalNoteButtonClick={() => onBottomButtonClick('medicalNotes')}
            onPatientProfileButtonClick={() =>
              onBottomButtonClick('patientProfile')
            }
          />
        )}
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

const StyledPopup = styled(Popup)`
  .adm-popup-body {
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.palette.primary1.main} !important;
    border-top-left-radius: ${({ theme }) => theme.spacing.xs};
    border-top-right-radius: ${({ theme }) => theme.spacing.xs};
  }

  .adm-popup-body::after {
    background: ${({ theme }) => addAlpha(theme.palette.common.white, 0.05)};
    content: ' ';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -2;
  }
`;
