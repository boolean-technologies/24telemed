import { EditorWithSaveButton } from './EditorWithSaveButton';
import { NoteFormProps } from './types';
import { useUpdateNote } from './useUpdateNote';

export function AssessmentAndDiagnosis({ value, readOnly }: NoteFormProps) {
  const send  = useUpdateNote("assessment_and_diagnosis");
  return (
    <EditorWithSaveButton
      onSave={send}
      placeholder="Click to start typing diagnosis and assessment..."
      saveText="Save diagnosis"
      title="Diagnosis & Assessment"
      value={value}
      readOnly={readOnly}
    />
  );
}
