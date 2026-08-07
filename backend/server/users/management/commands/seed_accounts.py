from datetime import date

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from patient.models import Patient

User = get_user_model()

DEFAULT_PASSWORD = 'Password123!'

# --- 3 approved doctors -----------------------------------------------------
DOCTORS = [
    {
        'username': 'dr.ada',
        'first_name': 'Ada',
        'last_name': 'Okafor',
        'email': 'ada.okafor@24telemed.test',
        'phone_number': '08030000001',
        'specialty': 'General Medicine',
        'location': 'Awka, Anambra',
        'description': 'Family physician with 10 years of primary-care experience.',
    },
    {
        'username': 'dr.emeka',
        'first_name': 'Emeka',
        'last_name': 'Nwankwo',
        'email': 'emeka.nwankwo@24telemed.test',
        'phone_number': '08030000002',
        'specialty': 'Cardiology',
        'location': 'Enugu',
        'description': 'Consultant cardiologist focused on hypertension management.',
    },
    {
        'username': 'dr.fatima',
        'first_name': 'Fatima',
        'last_name': 'Bello',
        'email': 'fatima.bello@24telemed.test',
        'phone_number': '08030000003',
        'specialty': 'Paediatrics',
        'location': 'Abuja',
        'description': 'Paediatrician caring for infants and children.',
    },
]

# --- 3 approved nurses (provider accounts flagged as nurse) ------------------
NURSES = [
    {
        'username': 'nurse.grace',
        'first_name': 'Grace',
        'last_name': 'Nwosu',
        'email': 'grace.nwosu@24telemed.test',
        'phone_number': '08040000001',
        'specialty': 'Community Nursing',
        'location': 'Awka, Anambra',
        'description': 'Registered nurse offering virtual home-visit support.',
    },
    {
        'username': 'nurse.joy',
        'first_name': 'Joy',
        'last_name': 'Adeyemi',
        'email': 'joy.adeyemi@24telemed.test',
        'phone_number': '08040000002',
        'specialty': 'Maternal Health',
        'location': 'Lagos',
        'description': 'Midwife supporting antenatal and postnatal care.',
    },
    {
        'username': 'nurse.samuel',
        'first_name': 'Samuel',
        'last_name': 'Okon',
        'email': 'samuel.okon@24telemed.test',
        'phone_number': '08040000003',
        'specialty': 'Wound Care',
        'location': 'Port Harcourt',
        'description': 'Nurse specialising in chronic wound management.',
    },
]

# --- 3 self-service patients, each with a full medical record ---------------
PATIENTS = [
    {
        'username': 'patient.john',
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@24telemed.test',
        'phone_number': '08050000001',
        'record': {
            'age': 34,
            'date_of_birth': date(1990, 4, 12),
            'gender': 'Male',
            'address': 'Awka, Anambra',
            'blood_type': 'O+',
            'weight': 78.0,
            'height': 176.0,
            'allergies': 'Penicillin',
            'current_medications': 'Lisinopril 10mg once daily',
            'medical_history': 'Appendectomy in 2015. Occasional migraines.',
            'chronic_conditions': 'Hypertension (diagnosed 2021)',
            'immunization_record': 'COVID-19 (2 doses), Hepatitis B, Yellow fever',
            'family_medical_history': 'Father: hypertension. Mother: type 2 diabetes.',
        },
    },
    {
        'username': 'patient.mary',
        'first_name': 'Mary',
        'last_name': 'Johnson',
        'email': 'mary.johnson@24telemed.test',
        'phone_number': '08050000002',
        'record': {
            'age': 28,
            'date_of_birth': date(1996, 9, 3),
            'gender': 'Female',
            'address': 'Ikeja, Lagos',
            'blood_type': 'A+',
            'weight': 63.0,
            'height': 165.0,
            'allergies': 'None known',
            'current_medications': 'Ferrous sulphate (iron supplement)',
            'medical_history': 'Mild asthma since childhood.',
            'chronic_conditions': 'Asthma',
            'immunization_record': 'COVID-19 (2 doses), Tetanus (2022)',
            'family_medical_history': 'Mother: asthma.',
        },
    },
    {
        'username': 'patient.ibrahim',
        'first_name': 'Ibrahim',
        'last_name': 'Musa',
        'email': 'ibrahim.musa@24telemed.test',
        'phone_number': '08050000003',
        'record': {
            'age': 45,
            'date_of_birth': date(1979, 1, 20),
            'gender': 'Male',
            'address': 'Kaduna',
            'blood_type': 'B+',
            'weight': 85.0,
            'height': 180.0,
            'allergies': 'Sulfa drugs',
            'current_medications': 'Metformin 500mg twice daily',
            'medical_history': 'Type 2 diabetes diagnosed 2018. Well controlled.',
            'chronic_conditions': 'Type 2 diabetes',
            'immunization_record': 'COVID-19 (booster), Hepatitis B',
            'family_medical_history': 'Father: type 2 diabetes. Sibling: hypertension.',
        },
    },
]


class Command(BaseCommand):
    help = (
        'Seed demo accounts: 3 approved doctors, 3 approved nurses and 3 '
        'patients (with full medical records). Idempotent — safe to re-run.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--password',
            default=DEFAULT_PASSWORD,
            help=f'Password for every seeded account (default: {DEFAULT_PASSWORD})',
        )
        parser.add_argument(
            '--reset-passwords',
            action='store_true',
            help='Reset the password on accounts that already exist.',
        )

    def _upsert_provider(self, data, provider_role, password, reset_pw):
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'email': data['email'],
                'phone_number': data['phone_number'],
                'specialty': data['specialty'],
                'location': data['location'],
                'description': data['description'],
            },
        )
        user.user_type = 'doctor'          # provider/callee account
        user.provider_role = provider_role  # 'doctor' or 'nurse'
        user.is_verified = True             # approved so patients can reach them
        if created or reset_pw:
            user.set_password(password)
        user.save()
        return user, created

    def _upsert_patient(self, data, password, reset_pw):
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'email': data['email'],
                'phone_number': data['phone_number'],
            },
        )
        user.user_type = 'customer'
        user.is_verified = True
        if created or reset_pw:
            user.set_password(password)
        user.save()

        record = data['record']
        profile, _ = Patient.objects.get_or_create(
            user=user,
            defaults={
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'phone_number': data['phone_number'],
                **record,
            },
        )
        return user, profile, created

    @transaction.atomic
    def handle(self, *args, **options):
        password = options['password']
        reset_pw = options['reset_passwords']

        self.stdout.write(self.style.MIGRATE_HEADING('\nDoctors:'))
        for data in DOCTORS:
            _, created = self._upsert_provider(data, 'doctor', password, reset_pw)
            self._line(data['username'], data['first_name'], data['last_name'], created)

        self.stdout.write(self.style.MIGRATE_HEADING('\nNurses:'))
        for data in NURSES:
            _, created = self._upsert_provider(data, 'nurse', password, reset_pw)
            self._line(data['username'], data['first_name'], data['last_name'], created)

        self.stdout.write(self.style.MIGRATE_HEADING('\nPatients (with medical records):'))
        for data in PATIENTS:
            _, profile, created = self._upsert_patient(data, password, reset_pw)
            self._line(
                data['username'],
                data['first_name'],
                data['last_name'],
                created,
                extra=f'record {profile.patient_id}',
            )

        self.stdout.write(
            self.style.SUCCESS(f'\nDone. Password for all accounts: {password}\n')
        )
        self.stdout.write(
            'Doctors/nurses log in on the "Doctor" tab; patients on the "Patient" tab.\n'
        )

    def _line(self, username, first, last, created, extra=''):
        tag = self.style.SUCCESS('created') if created else self.style.WARNING('exists ')
        suffix = f'  ({extra})' if extra else ''
        self.stdout.write(f'  [{tag}] {username:<16} {first} {last}{suffix}')
