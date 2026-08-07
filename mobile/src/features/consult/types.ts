import type { Ionicons } from '@expo/vector-icons';

/** The three consultation types offered on the patient dashboard. */
export type ConsultationTypeKey =
  | 'e_consultation'
  | 'second_opinion'
  | 'nursing_visit';

/** Provider account kind (a `doctor`-type user marked as doctor or nurse). */
export type ProviderRole = 'doctor' | 'nurse';

export type ConsultOption = {
  key: ConsultationTypeKey;
  label: string;
  short: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Which providers to show for this consult type. */
  providerRole: ProviderRole;
  /** Noun for the provider list ("doctor" / "nurse"). */
  providerNoun: string;
};

export const CONSULT_OPTIONS: ConsultOption[] = [
  {
    key: 'e_consultation',
    label: 'E-consultation',
    short: 'E-consult',
    description: 'Speak with a doctor by video now',
    icon: 'videocam',
    providerRole: 'doctor',
    providerNoun: 'doctor',
  },
  {
    key: 'second_opinion',
    label: 'Second Medical Opinion',
    short: '2nd Medical Opinion',
    description: 'Get another expert view on your case',
    icon: 'people',
    providerRole: 'doctor',
    providerNoun: 'doctor',
  },
  {
    key: 'nursing_visit',
    label: 'Virtual Nursing Home Visit',
    short: 'Virtual Nursing Home',
    description: 'A virtual visit with a nurse',
    icon: 'medkit',
    providerRole: 'nurse',
    providerNoun: 'nurse',
  },
];

export function consultOption(key: ConsultationTypeKey): ConsultOption {
  return CONSULT_OPTIONS.find((o) => o.key === key) ?? CONSULT_OPTIONS[0];
}

/** Human label for a stored consultation_type value (safe for unknown values). */
export function consultationTypeLabel(key?: string | null): string {
  return CONSULT_OPTIONS.find((o) => o.key === key)?.label ?? 'E-consultation';
}
