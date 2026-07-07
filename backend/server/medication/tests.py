from datetime import date
from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from patient.models import Patient
from users.models import User
from .models import MedicalEncounter, PrescribedDrug


class ConsultationRecordTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.doctor = User.objects.create_user(
            username='record_doctor',
            password='Password!42',
            user_type='doctor',
        )
        self.patient_user = User.objects.create_user(
            username='record_patient',
            password='Password!42',
            user_type='customer',
        )
        self.other_patient = User.objects.create_user(
            username='other_patient',
            password='Password!42',
            user_type='customer',
        )
        self.patient = Patient.objects.create(
            patient_id='10000000001',
            phone_number='08000000001',
            first_name='Test',
            last_name='Patient',
            age=30,
            date_of_birth=date(1996, 1, 1),
            gender='Female',
            user=self.patient_user,
        )
        self.encounter = MedicalEncounter.objects.create(
            doctor=self.doctor,
            patient=self.patient,
            reason_for_visit='Headache',
        )

    @patch('medication.views.send_push_to_user', return_value=True)
    def test_doctor_can_add_notes_and_prescribe_by_name(self, push):
        self.client.force_authenticate(self.doctor)
        notes = self.client.patch(
            f'/doctors/medical-encounters/doctor-medical-encounters/{self.encounter.id}/',
            {'assessment_and_diagnosis': 'Tension headache'},
            format='json',
        )
        self.assertEqual(notes.status_code, 200)

        prescription = self.client.post(
            f'/doctors/medical-encounters/doctor-medical-encounters/{self.encounter.id}/prescribe/',
            {
                'drug_name': 'Paracetamol',
                'dosage': '500 mg',
                'frequency': 'Twice daily',
                'duration': '3 days',
                'instructions': 'Take after food',
            },
            format='json',
        )
        self.assertEqual(prescription.status_code, 201)
        self.assertEqual(PrescribedDrug.objects.count(), 1)
        self.assertEqual(
            prescription.data['drug_detail']['name'], 'Paracetamol'
        )
        push.assert_called_once()

    def test_patient_can_only_read_own_encounter(self):
        self.client.force_authenticate(self.patient_user)
        own = self.client.get(
            f'/doctors/medical-encounters/personnel-medical-encounters/{self.encounter.id}/'
        )
        self.assertEqual(own.status_code, 200)

        self.client.force_authenticate(self.other_patient)
        hidden = self.client.get(
            f'/doctors/medical-encounters/personnel-medical-encounters/{self.encounter.id}/'
        )
        self.assertEqual(hidden.status_code, 404)
