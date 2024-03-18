import { EditorWithSaveButton } from './EditorWithSaveButton';
import { NoteFormProps } from './types';
import { useUpdateNote } from './useUpdateNote';

export function TreatmentAndInterventions({ value, readOnly }: NoteFormProps) {
  const send  = useUpdateNote("treatment_and_interventions");
  return (
    <EditorWithSaveButton
      onSave={send}
      placeholder="Click to start typing treatments for patient..."
      saveText="Save treatments"
      title="Treatments & Interventions"
      value={value}
      readOnly={readOnly}
    />
  );
}
