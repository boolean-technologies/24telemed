import { useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { message } from 'antd';
import { findLast, get } from 'lodash-es';
import { NoteType } from './types';
import { useEffect, useState } from 'react';
import { playNotificationSound } from '../../../../utils'

export type SectionsType = {
  section: NoteType;
  hasNotication: boolean;
  content: string;
  icon: string;
}[];

export function useMedicalNoteSections(type: NoteType): SectionsType {
  const { localParticipant } = useMeeting();
  const [hasNotification, setHasNotification] = useState<{
    reason_for_visit: boolean;
    assessment_and_diagnosis: boolean;
    treatment_and_interventions: boolean;
    follow_up_plans: boolean;
  }>({
    reason_for_visit: false,
    assessment_and_diagnosis: false,
    treatment_and_interventions: false,
    follow_up_plans: false,
  });

  useEffect(() => {
    if (type) setHasNotification((prev) => ({ ...prev, [type]: false }));
  }, [type, hasNotification[type]]);

  const { messages = [] } = usePubSub('MEDICALNOTES', {
    onMessageReceived: (incomingMessage) => {
      if (incomingMessage?.senderId !== localParticipant?.id) {
        playNotificationSound();
        message.info('Patient medical note has been updated', 10);
        switch ((incomingMessage.payload as { type: string }).type) {
          case 'reason_for_visit':
            setHasNotification((prev) => ({ ...prev, reason_for_visit: true }));
            break;
          case 'assessment_and_diagnosis':
            setHasNotification((prev) => ({
              ...prev,
              assessment_and_diagnosis: true,
            }));
            break;
          case 'treatment_and_interventions':
            setHasNotification((prev) => ({
              ...prev,
              treatment_and_interventions: true,
            }));
            break;
          case 'follow_up_plans':
            setHasNotification((prev) => ({ ...prev, follow_up_plans: true }));
            break;
        }
      }
    },
  });

  const getLastMessage = (type: NoteType) => {
    const record = findLast(
      messages,
      (record) => get(record, 'payload.type') === type
    );
    return record?.message || '';
  };

  return [
    {
      section: 'reason_for_visit',
      hasNotication: hasNotification.reason_for_visit,
      content: getLastMessage('reason_for_visit'),
      icon: 'information-circle',
    },
    {
      section: 'assessment_and_diagnosis',
      hasNotication: hasNotification.assessment_and_diagnosis,

      content: getLastMessage('assessment_and_diagnosis'),
      icon: 'pulse',
    },
    {
      section: 'treatment_and_interventions',
      hasNotication: hasNotification.treatment_and_interventions,

      content: getLastMessage('treatment_and_interventions'),
      icon: 'bulb',
    },
    {
      section: 'follow_up_plans',
      hasNotication: hasNotification.follow_up_plans,

      content: getLastMessage('follow_up_plans'),
      icon: 'today',
    },
  ];
}
