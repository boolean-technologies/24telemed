import { useCallback } from 'react';
import { usePubSub } from '@videosdk.live/react-sdk';
import { NoteType } from './types';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateMedicalEncounter } from '../../../api/encounter';
import { useCallContext } from '../../../context/AppContext';

export function useUpdateNote(type: NoteType) {
  const queryClient = useQueryClient();
  const updateMedicalEncounter = useUpdateMedicalEncounter();
  const { callLog } = useCallContext();

  const medicalEncounter = callLog.medical_encounter;

  const saveNotes = useCallback(
    (note: string) => {
      updateMedicalEncounter.mutate(
        {
          id: medicalEncounter as string,
          data: {
            [type]: note,
          } as any,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medicalEncounters'] });
          },
        }
      );
    },
    [type, medicalEncounter]
  );

  const { publish } = usePubSub('MEDICALNOTES');
  const send = useCallback(
    (note: string) => {
      publish(note, { persist: true }, { type });
    },
    [publish, saveNotes, type]
  );

  return send;
}