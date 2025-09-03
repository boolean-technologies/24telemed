import { useState } from 'react';
import { useGetPatientMedicalEncounters } from '../../api/patient';
import { MedicalEncounterHistory } from '@local/shared-components';

interface MedicalEncountersProps {
  patientId: string;
}

export function MedicalEncounters({ patientId }: MedicalEncountersProps) {
  const [pagination, setPagination] = useState({ page: 1, size: 5 });
  const { data: medicalEncounter, isLoading } = useGetPatientMedicalEncounters({
    patient: patientId,
    page: pagination.page,
    size: pagination.size,
  });

  return (
    <MedicalEncounterHistory
      total={medicalEncounter?.count}
      encounters={medicalEncounter?.results ?? []}
      pageSize={pagination.size}
      onPaginationChange={(page, size) => setPagination({ page, size })}
      isLoading={isLoading}
    />
  );
}