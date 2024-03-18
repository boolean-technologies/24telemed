import { useDoctorCommunication } from '@local/websocket';
import { useEffect, useRef, useState } from 'react';
import incomingCallRing from '../../assets/icoming-call-ring.mp3';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../constants';

export function useIncomingCall() {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [declineNote, setDeclineNote] = useState<string>();
  const { hasIncomingCall, message, declineCall, answerCall } =
    useDoctorCommunication();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateData = () => queryClient.invalidateQueries({ queryKey: ["callLogs"] });

  const handleAnswerCall = () => {
    answerCall();
    updateData();
    setDeclineNote(undefined);
    setShowNoteInput(false);
    navigate(Path.meeting+"/"+(message?.data as { id: string })?.id);
  };

  const handleDeclineCall = () => {
    declineCall(declineNote);
    updateData();
    setDeclineNote(undefined);
    setShowNoteInput(false);
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(incomingCallRing);
      audioRef.current.loop = true;
    }

    const startPlaying = () => {
      audioRef.current
        ?.play()
        .catch((error) => console.error('Error playing the audio', error));
    };

    const stopPlaying = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    if (hasIncomingCall) {
      startPlaying();
      updateData();
    } else {
      stopPlaying();
    }

    return () => {
      stopPlaying();
    };
  }, [hasIncomingCall]);

  return {
    hasIncomingCall,
    message,
    showNoteInput,
    setShowNoteInput,
    setDeclineNote,
    handleAnswerCall,
    handleDeclineCall,
  };
}
