from decimal import Decimal

from django.core.management.base import BaseCommand

from partners.models import Partner, PartnerService

PARTNER = {
    'slug': 'uriel-icare',
    'name': 'Uriel I-Care Hospital',
    'tagline': 'Specialist consultations with Uriel I-Care doctors',
    'settlement_bank_code': '232',  # Sterling Bank
    'commission_percent': Decimal('15.00'),
}

SERVICES = [
    {
        'name': 'Life is Sweet Clinic: Sexual Health Consultation (Men & Women)',
        'description': 'With Dr. Doris Agbani Briggs.',
        'fee': Decimal('200000'),
    },
    {
        'name': 'General & Mental Health Consultation',
        'description': 'With Dr. Clinton (GP), Dr. Akene (GP) or Dr. Frank Joseph (Sr. mental health specialist).',
        'fee': Decimal('205000'),
    },
    {
        'name': 'Social Care Services Consultation',
        'description': 'With Dr. Doris Agbani Briggs.',
        'fee': Decimal('180000'),
    },
]


class Command(BaseCommand):
    help = 'Creates the Uriel I-Care partner and its services (existing records are left untouched).'

    def handle(self, *args, **options):
        partner, created = Partner.objects.get_or_create(
            slug=PARTNER['slug'], defaults={k: v for k, v in PARTNER.items() if k != 'slug'}
        )
        self.stdout.write(f'{"Created" if created else "Exists"}: {partner.name}')
        for order, service in enumerate(SERVICES):
            _, created = PartnerService.objects.get_or_create(
                partner=partner, name=service['name'], defaults={**service, 'sort_order': order}
            )
            self.stdout.write(f'  {"Created" if created else "Exists"}: {service["name"]}')
        self.stdout.write(self.style.WARNING(
            'Next, in /admin/partners/partner/: set the settlement account number, run '
            '"Create / sync Paystack subaccount", and assign doctors to each service.'
        ))
