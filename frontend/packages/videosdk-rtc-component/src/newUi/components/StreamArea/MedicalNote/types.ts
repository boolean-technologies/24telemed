export type NoteType = "reason_for_visit" | "assessment_and_diagnosis" | "treatment_and_interventions" | "follow_up_plans";


export type NoteFormProps = {
    value?: string;
    readOnly?: boolean;
}