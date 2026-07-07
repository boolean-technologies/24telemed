from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from booking.models import Booking, BookingStatus
from utils.push_notifications import send_push_to_user


class Command(BaseCommand):
    help = 'Send push reminders for confirmed appointments that are due soon.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--minutes',
            type=int,
            default=30,
            help='Notify for appointments due within this many minutes.',
        )

    def handle(self, *args, **options):
        now = timezone.now()
        minutes = options['minutes']
        due_before = now + timedelta(minutes=minutes)
        bookings = Booking.objects.select_related(
            'doctor', 'health_care_assistant'
        ).filter(
            status=BookingStatus.CONFIRMED,
            reminder_sent_at__isnull=True,
            scheduled_time__gt=now,
            scheduled_time__lte=due_before,
        )

        sent = 0
        for booking in bookings:
            doctor_sent = send_push_to_user(
                booking.doctor,
                title='Appointment starting soon',
                body=f'Your telemedicine appointment starts within {minutes} minutes.',
                data={
                    'type': 'booking_reminder',
                    'booking_id': str(booking.id),
                    'route': '/(doctor)/(tabs)/bookings',
                },
            )
            patient_sent = send_push_to_user(
                booking.health_care_assistant,
                title='Appointment starting soon',
                body=f'Your appointment with Dr. {booking.doctor.first_name or booking.doctor.username} starts within {minutes} minutes.',
                data={
                    'type': 'booking_reminder',
                    'booking_id': str(booking.id),
                    'route': '/(patient)/(tabs)/bookings',
                },
            )
            if doctor_sent or patient_sent:
                booking.reminder_sent_at = now
                booking.save(update_fields=['reminder_sent_at'])
                sent += 1

        self.stdout.write(self.style.SUCCESS(f'Sent reminders for {sent} booking(s).'))
