import { FloatButton, Layout } from 'antd';
import { Popup } from 'antd-mobile';
import { useState } from 'react';
import styled from 'styled-components';
import { BottomBar } from './BottomBar';
import {
  Flex,
  IonIcon,
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
  const [isOpenMobileMenus, setIsOpenMobileMenus] = useState<boolean>();
  const [sideView, setSideView] =
    useState<StreamAreaProps['sideView']>(defaultSideView);
  const [activeNoteSection, setActiveNoteSection] =
    useState<NoteType>('reason_for_visit');
  const medicalNoteSections = useMedicalNoteSections(activeNoteSection);

  const onBottomButtonClick = (view: StreamAreaProps['sideView']) => {
    setSideView(sideView === view ? undefined : view);
    setIsOpenMobileMenus(false);
  };

  const hasBottomNotification = Boolean(
    medicalNoteSections.find((e) => e.hasNotication)
  );

  const menuGroup = (
    <BottomBar
      currentView={sideView}
      meetingTitle={meetingTitle}
      hasNoteNotification={hasBottomNotification}
      onChatClick={() => onBottomButtonClick('chats')}
      onMedicationButtonClick={() => onBottomButtonClick('medication')}
      onMedicalNoteButtonClick={() => onBottomButtonClick('medicalNotes')}
      onPatientProfileButtonClick={() => onBottomButtonClick('patientProfile')}
    />
  );

  return (
    <StyledRoot>
      <Flex
        direction="column"
        flex={1}
        gap="md"
        padding="md"
        xsPadding="none"
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

        {isMobile ? (
          <StyledPopup
            visible={isOpenMobileMenus}
            bodyStyle={{
              overflow: 'scroll',
              minHeight: 240,
            }}
            onClose={() => setIsOpenMobileMenus(false)}
            onMaskClick={() => setIsOpenMobileMenus(false)}
          >
            {menuGroup}
          </StyledPopup>
        ) : (
          menuGroup
        )}
      </Flex>
      {isMobile && !sideView ? (
        <FloatButton
          icon={<IonIcon name="menu" color="primary2.main" />}
          type="primary"
          style={{ marginRight: 22 }}
          onClick={() => setIsOpenMobileMenus(true)}
        />
      ) : null}
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
    border-top-left-radius: ${({ theme }) => theme.spacing.md};
    border-top-right-radius: ${({ theme }) => theme.spacing.md};
  }

  .adm-popup-body::after {
    background: ${({ theme }) => addAlpha(theme.palette.common.white, 0.085)};
    content: " ";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -2;
  }
`;
