import { createContext, useContext } from 'react';

type NotesChannel = {
  /** No-op outside an active call (e.g. when viewing consultation history). */
  notifyNoteUpdate: () => void;
};

const NotesChannelContext = createContext<NotesChannel>({
  notifyNoteUpdate: () => {},
});

export const NotesChannelProvider = NotesChannelContext.Provider;

export function useNotesChannel(): NotesChannel {
  return useContext(NotesChannelContext);
}
