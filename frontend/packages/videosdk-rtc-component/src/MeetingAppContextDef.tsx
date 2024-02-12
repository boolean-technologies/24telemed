import React, { useContext, createContext, useState, useEffect, useRef } from "react";
type MeetingAppContextType = {
  raisedHandsParticipants: any[];
  sideBarMode: string | null;
  pipMode: boolean;
  setRaisedHandsParticipants: (participants: any[]) => void;
  setSideBarMode: React.Dispatch<React.SetStateAction<null>>;
  setPipMode: (pipMode: boolean) => void;
  useRaisedHandParticipants: () => {
    participantRaisedHand: (participantId: string) => void;
  };
};

export const MeetingAppContext = createContext < MeetingAppContextType > ({
  raisedHandsParticipants: [],
  sideBarMode: null,
  pipMode: false,
  setRaisedHandsParticipants: () => {},
  setSideBarMode: () => {},
  setPipMode: () => {},
  useRaisedHandParticipants: () => ({
    participantRaisedHand: () => {},
  }),
});

export const useMeetingAppContext = () => useContext(MeetingAppContext);
type MeeetingAppProviderProps = {
  children: React.ReactNode;
};

type RaiseHandParticipantType = {
  participantId: string;
  raisedHandOn: number;
}

export const MeetingAppProvider = ({ children }: MeeetingAppProviderProps) => {
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<RaiseHandParticipantType[]>([]);
  const [sideBarMode, setSideBarMode] = useState(null);
  const [pipMode, setPipMode] = useState(false);

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef<any>([]);

    const participantRaisedHand = (participantId: string) => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const newItem = { participantId, raisedHandOn: new Date().getTime() };

      const participantFound = raisedHandsParticipants.findIndex(
        ({ participantId: pID }) => pID === participantId
      );

      if (participantFound === -1) {
        raisedHandsParticipants.push(newItem);
      } else {
        raisedHandsParticipants[participantFound] = newItem;
      }

      setRaisedHandsParticipants(raisedHandsParticipants);
    };

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    const _handleRemoveOld = () => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const now = new Date().getTime();

      const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
        return parseInt(raisedHandOn) + 15000 > now;
      });

      if (raisedHandsParticipants.length !== persisted.length) {
        setRaisedHandsParticipants(persisted);
      }
    };

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return { participantRaisedHand };
  };

  return (
    <MeetingAppContext.Provider
      value={{
        // states

        raisedHandsParticipants,

        sideBarMode,
        pipMode,
        // setters

        setRaisedHandsParticipants,

        setSideBarMode,
        setPipMode,
        useRaisedHandParticipants,
      }}
    >
      {children}
    </MeetingAppContext.Provider>
  );
};
