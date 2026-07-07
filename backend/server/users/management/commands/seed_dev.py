from datetime import date

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from patient.models import Patient

User = get_user_model()

PASSWORD = 'password123'


class Command(BaseCommand):
    help = 'Create test accounts (approved doctor + self-service patient) for local dev.'

    def handle(self, *args, **options):
        # --- Approved doctor (visible to patients, can take calls) ---
        doctor, _ = User.objects.get_or_create(
            username='doctor',
            defaults={
                'first_name': 'Ada',
                'last_name': 'Okafor',
                'email': 'doctor@example.com',
                'specialty': 'General Medicine',
            },
        )
        doctor.user_type = 'doctor'
        doctor.provider_role = 'doctor'
        doctor.is_verified = True  # approved
        doctor.set_password(PASSWORD)
        doctor.save()

        # --- Approved nurse (shown for "Virtual Nursing Home Visit") ---
        nurse, _ = User.objects.get_or_create(
            username='nurse',
            defaults={
                'first_name': 'Grace',
                'last_name': 'Nwosu',
                'email': 'nurse@example.com',
                'specialty': 'Community Nursing',
            },
        )
        nurse.user_type = 'doctor'      # provider account (callee), flagged as nurse
        nurse.provider_role = 'nurse'
        nurse.is_verified = True         # approved
        nurse.set_password(PASSWORD)
        nurse.save()

        # --- Self-service patient (customer) with a linked medical record ---
        patient_user, _ = User.objects.get_or_create(
            username='patient',
            defaults={
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'patient@example.com',
                'phone_number': '08011112222',
            },
        )
        patient_user.user_type = 'customer'
        patient_user.is_verified = True
        patient_user.set_password(PASSWORD)
        patient_user.save()

        patient_profile, _ = Patient.objects.get_or_create(
            user=patient_user,
            defaults={
                'first_name': 'John',
                'last_name': 'Doe',
                'phone_number': '08011112222',
                'age': 34,
                'date_of_birth': date(1990, 1, 1),
                'gender': 'Male',
                'address': 'Awka, Anambra',
                'blood_type': 'O+',
            },
        )

        # --- Unapproved doctor (to demo the admin-approval gate) ---
        pending, _ = User.objects.get_or_create(
            username='doctor_pending',
            defaults={
                'first_name': 'Chidi',
                'last_name': 'Eze',
                'email': 'pending@example.com',
                'specialty': 'Cardiology',
            },
        )
        pending.user_type = 'doctor'
        pending.is_verified = False  # awaiting approval
        pending.set_password(PASSWORD)
        pending.save()

        self.stdout.write(self.style.SUCCESS('\nSeeded local dev accounts:\n'))
        self.stdout.write(f'  PATIENT  (login as Patient)')
        self.stdout.write(f'    username: patient        password: {PASSWORD}')
        self.stdout.write(
            f'    linked record: {patient_profile.first_name} '
            f'{patient_profile.last_name} (ID {patient_profile.patient_id})\n'
        )
        self.stdout.write(f'  DOCTOR — approved (login as Doctor)')
        self.stdout.write(f'    username: doctor         password: {PASSWORD}\n')
        self.stdout.write(f'  NURSE — approved (shows under "Virtual Nursing Home Visit"; login as Doctor)')
        self.stdout.write(f'    username: nurse          password: {PASSWORD}\n')
        self.stdout.write(f'  DOCTOR — pending approval (will show "awaiting approval")')
        self.stdout.write(f'    username: doctor_pending password: {PASSWORD}')
        self.stdout.write('    approve at /admin (Users -> tick is_verified)\n')
