import { EditorWithSaveButton } from './EditorWithSaveButton';
import { NoteFormProps } from './types';
import { useUpdateNote } from './useUpdateNote';

export function FollowUpPlan({ value, readOnly }: NoteFormProps) {
  const send  = useUpdateNote("follow_up_plans");
  return (
    <EditorWithSaveButton
      onSave={send}
      placeholder="Click to start typing follow up plan for patient..."
      saveText="Save plan"
      title="Follow up plan"
      value={value}
      readOnly={readOnly}
    />
  );
}
