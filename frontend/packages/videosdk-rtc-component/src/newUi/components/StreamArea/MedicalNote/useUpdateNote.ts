import { usePubSub } from "@videosdk.live/react-sdk";
import { NoteType } from "./types";


export function useUpdateNote(type: NoteType){

    const saveNotes = (note: string) => {
        // handle DB saving here
    }

    const { publish } = usePubSub('MEDICALNOTES');

    const send = (note: string) => {
        saveNotes(note);
        publish(note, { persist: true }, { type })
    }

    return send
}