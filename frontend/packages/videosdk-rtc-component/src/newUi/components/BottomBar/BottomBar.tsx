import { Flex, Typography } from '@local/shared-components';
import { ChatButton } from './ChatButton';
import { MedicalNotesButton } from './MedicalNotesButton';
import { VideoButton } from './VideoButton';
import { MicButton } from './MicButton';
import { PatientInfoButton } from './PatientInfoButton';
import { EndCallButton } from './EndCallButton';
import { StreamAreaProps } from '../StreamArea';
import { ClockDisplay } from './ClockDisplay';
import styled from 'styled-components';
import { CallCountDown } from '../CountDown';

type BottomBarProps = {
  meetingTitle: string;
  currentView: StreamAreaProps['sideView'];
  onMedicationButtonClick: () => void;
  onChatClick: () => void;
  onMedicalNoteButtonClick: () => void;
  onPatientProfileButtonClick: () => void;
  hasNoteNotification: boolean;
  callTime: Date;
  callDurationLimit: number;
};

export function BottomBar({
  meetingTitle = '',
  currentView,
  hasNoteNotification,
  onChatClick,
  onMedicationButtonClick,
  onMedicalNoteButtonClick,
  onPatientProfileButtonClick,
  callTime,
  callDurationLimit,
}: BottomBarProps) {
  return (
    <Flex smDirection="column">
      <Flex gap="xs">
        <ClockDisplay />
        <Typography color="common.white" weight="bold">
          |
        </Typography>
        <Typography color="common.white" weight="bold">
          {meetingTitle}
        </Typography>
        <Typography color="common.white" weight="bold">
          |
        </Typography>
        <CallCountDown
          callTime={callTime}
          callDurationLimit={callDurationLimit}
        />
      </Flex>
      <Flex fullWidth justify="center" flex={1}>
        <VideoButton />
        <MicButton />
        <EndCallButton />
      </Flex>
      <Flex justify="flex-end">
        <PatientInfoButton
          active={currentView === 'patientProfile'}
          onClick={onPatientProfileButtonClick}
        />
        <MedicalNotesButton
          active={currentView === 'medicalNotes'}
          onClick={onMedicalNoteButtonClick}
          hasNotification={hasNoteNotification}
        />
        <ChatButton active={currentView === 'chats'} onClick={onChatClick} />
      </Flex>
    </Flex>
  );
}

export function TopCallTools({
  currentView,
  hasNoteNotification,
  onChatClick,
  onMedicationButtonClick,
  onMedicalNoteButtonClick,
  onPatientProfileButtonClick,
}: Omit<BottomBarProps, 'meetingTitle' | 'callTime' | 'callDurationLimit'>) {
  return (
    <StyledCallTools>
      <Flex direction="column" justify="flex-end" padding="sm">
        <PatientInfoButton
          active={currentView === 'patientProfile'}
          onClick={onPatientProfileButtonClick}
        />
        <MedicalNotesButton
          active={currentView === 'medicalNotes'}
          onClick={onMedicalNoteButtonClick}
          hasNotification={hasNoteNotification}
        />
        {/* TODO: Bring back the meds button when medication feature is been added */}
        {/* <MedicationButton
          active={currentView === 'medication'}
          onClick={onMedicationButtonClick}
        /> */}
        
      </Flex>
    </StyledCallTools>
  );
}

export function BottomBarMobile({
  currentView,
  onChatClick,
  meetingTitle = '',
  callTime,
  callDurationLimit,
}: Pick<
  BottomBarProps,
  | 'meetingTitle'
  | 'currentView'
  | 'onChatClick'
  | 'callTime'
  | 'callDurationLimit'
>) {
  return (
    <Flex direction="column">
      <Flex gap="xs">
        <ClockDisplay />
        <Typography color="common.white" weight="bold">
          |
        </Typography>
        <Typography color="common.white" weight="bold">
          {meetingTitle}
        </Typography>
        <Typography color="common.white" weight="bold">
          |
        </Typography>
        <CallCountDown
          callTime={callTime}
          callDurationLimit={callDurationLimit}
        />
      </Flex>
      <StyledBottomBarMobileInnerRoot>
        <Flex fullWidth flex={1}>
          <Flex flex={1}>
            <VideoButton />
            <MicButton />
            <ChatButton
              hideLabel
              active={currentView === 'chats'}
              onClick={onChatClick}
            />
          </Flex>
          <EndCallButton />
        </Flex>
      </StyledBottomBarMobileInnerRoot>
    </Flex>
  );
}

const StyledBottomBarMobileInnerRoot = styled.div`
  background: rgba(255, 255, 255, 0.1);
  margin-left: -12px;
  margin-right: -12px;
  margin-bottom: -12px;
  padding: 12px;
  border-radius: 6px;
`;

const StyledCallTools = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`;
