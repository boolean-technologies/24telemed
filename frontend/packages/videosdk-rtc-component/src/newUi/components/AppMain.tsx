import { Drawer, FloatButton, Layout } from 'antd';
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
};
export function AppMain({ meetingTitle }: AppMainProps) {
  const { isXs } = useBreakpoints();
  const [isOpenMobileMenus, setIsOpenMobileMenus] = useState<boolean>();
  const [sideView, setSideView] = useState<StreamAreaProps['sideView']>(
    isXs ? undefined : 'patientProfile'
  );
  const [activeNoteSection, setActiveNoteSection] =
    useState<NoteType>('reason_for_visit');
  const medicalNoteSections = useMedicalNoteSections(activeNoteSection);

  const onBottomButtonClick = (view: StreamAreaProps['sideView']) => {
    setSideView(sideView === view ? undefined : view);
    setIsOpenMobileMenus(false);
  }

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
      <Flex direction="column" flex={1} gap="md" padding="md" xsPadding="none" fullWidth>
        <Flex flex={1}>
          <StreamArea
            sideView={sideView}
            onClose={() => setSideView(undefined)}
            activeNoteSection={activeNoteSection}
            setActiveNoteSection={setActiveNoteSection}
            medicalNoteSections={medicalNoteSections}
          />
        </Flex>
        {isXs ? (
          <StyledDrawer
            placement="bottom"
            onClose={() => setIsOpenMobileMenus(false)}
            open={isOpenMobileMenus}
            height={250}
          >
            {menuGroup}
          </StyledDrawer>
        ) : (
          menuGroup
        )}
      </Flex>
      {(isXs && !sideView) ? (
        <FloatButton
          icon={<IonIcon name="menu" color="primary2.main" />}
          type="primary"
          style={{ marginBottom: -18 }}
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

const StyledDrawer = styled(Drawer)`
  background: ${({ theme }) => theme.palette.primary1.main} !important;
  border-top-left-radius: ${({ theme }) => theme.spacing.md};
  border-top-right-radius: ${({ theme }) => theme.spacing.md};
  .ant-drawer-header {
    display: none;
  }
  .ant-drawer-body {
    background: ${({ theme }) =>
      addAlpha(theme.palette.primary1.lighter, 0.05)} !important;
  }
`;
