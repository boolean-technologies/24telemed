import { EditorWithSaveButton } from './EditorWithSaveButton';
import { NoteFormProps } from './types';
import { useUpdateNote } from './useUpdateNote';


export function VisitationReason({ value, readOnly }: NoteFormProps) {
  const send = useUpdateNote('reason_for_visit');
  return (
    <EditorWithSaveButton
      onSave={send}
      placeholder="Click to start typing reason for this medical visitation..."
      saveText="Save reason"
      title="Visitation Reason"
      value={value}
      readOnly={readOnly}
    />
  );
}
