import { Flex, Typography } from '@local/shared-components';
import { ChatButton } from './ChatButton';
import { MedicalNotesButton } from './MedicalNotesButton';
import { VideoButton } from './VideoButton';
import { MicButton } from './MicButton';
import { RaiseHandButton } from './RaiseHandButton';
import { PatientInfoButton } from './PatientInfoButton';
import { EndCallButton } from './EndCallButton';
import { MedicationButton } from './MedicationButton';
import { StreamAreaProps } from '../StreamArea';
import { ClockDisplay } from './ClockDisplay';

type BottomBarProps = {
  meetingTitle: string;
  currentView: StreamAreaProps['sideView'];
  onMedicationButtonClick: () => void;
  onChatClick: () => void;
  onMedicalNoteButtonClick: () => void;
  onPatientProfileButtonClick: () => void;
  hasNoteNotification: boolean;
};

export function BottomBar({
  meetingTitle = '',
  currentView,
  hasNoteNotification,
  onChatClick,
  onMedicationButtonClick,
  onMedicalNoteButtonClick,
  onPatientProfileButtonClick,
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
      </Flex>
      <Flex fullWidth justify="center" flex={1}>
        <VideoButton />
        <MicButton />
        <RaiseHandButton />
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
        <MedicationButton
          active={currentView === 'medication'}
          onClick={onMedicationButtonClick}
        />
        <ChatButton active={currentView === 'chats'} onClick={onChatClick} />
      </Flex>
    </Flex>
  );
}
