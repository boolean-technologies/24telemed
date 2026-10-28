import json
import logging
import uuid
from decimal import ROUND_HALF_UP, Decimal

from django.db import transaction
from django.utils import timezone

from . import paystack
from .models import ConsultationStatus, PartnerConsultation, PartnerMembership, PartnerService

logger = logging.getLogger(__name__)

METADATA_KIND = 'partner_consultation'


class PartnerConfigError(Exception):
    """The partner/service isn't set up to take payments yet."""


class PartnerCallError(Exception):
    """A call that the partner rules don't allow (unpaid, wrong doctor, ...)."""


def to_kobo(amount):
    return int((Decimal(amount) * 100).quantize(Decimal('1'), rounding=ROUND_HALF_UP))


def new_reference():
    return f'PC-{uuid.uuid4().hex[:24]}'


def commission_for(amount, percent):
    return (Decimal(amount) * Decimal(percent) / 100).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def get_partner_for(user):
    membership = getattr(user, 'partner_membership', None)
    return membership.partner if membership else None


def _as_uuid(value):
    try:
        return uuid.UUID(str(value))
    except (TypeError, ValueError):
        return None


# --- Payments -----------------------------------------------------------------

def create_consultation(user, service: PartnerService, reason='', patient=None):
    partner = service.partner
    subaccount_code = service.subaccount_code
    if not subaccount_code:
        raise PartnerConfigError(f'{partner.name} has no Paystack subaccount configured yet.')
    return PartnerConsultation.objects.create(
        partner=partner,
        service=service,
        user=user,
        patient=patient,
        reason=reason,
        amount=service.fee,
        currency=service.currency,
        commission_percent=partner.commission_percent,
        commission_amount=commission_for(service.fee, partner.commission_percent),
        subaccount_code=subaccount_code,
        reference=new_reference(),
    )


def initialize_payment(consultation: PartnerConsultation, callback_url: str) -> str:
    """Starts a Paystack checkout split to the partner's subaccount and returns
    the hosted payment page URL. A fresh reference is used on every attempt,
    because Paystack rejects re-initializing an unpaid reference."""
    if consultation.status != ConsultationStatus.PENDING_PAYMENT:
        raise PartnerConfigError('This consultation is not awaiting payment.')
    if not consultation.user.email:
        raise PartnerConfigError('Add an email address to your account before paying.')

    consultation.reference = new_reference()
    consultation.save(update_fields=['reference', 'updated_at'])

    data = paystack.initialize_transaction({
        'email': consultation.user.email,
        'amount': to_kobo(consultation.amount),
        'currency': consultation.currency,
        'reference': consultation.reference,
        'callback_url': callback_url,
        'subaccount': consultation.subaccount_code,
        # Flat override of the subaccount's default split: exactly our
        # commission goes to the main account, the rest to the partner.
        'transaction_charge': to_kobo(consultation.commission_amount),
        'bearer': consultation.partner.paystack_fee_bearer,
        'metadata': {
            'kind': METADATA_KIND,
            'consultation_id': str(consultation.id),
            'partner': consultation.partner.slug,
            'custom_fields': [
                {'display_name': 'Partner', 'variable_name': 'partner', 'value': consultation.partner.name},
                {'display_name': 'Service', 'variable_name': 'service', 'value': consultation.service.name},
            ],
        },
    })
    return data['authorization_url']


def charge_metadata(data):
    metadata = (data or {}).get('metadata') or {}
    if isinstance(metadata, str):
        try:
            metadata = json.loads(metadata)
        except ValueError:
            return {}
    return metadata if isinstance(metadata, dict) else {}


def is_partner_charge(data):
    return charge_metadata(data).get('kind') == METADATA_KIND


def apply_successful_charge(data):
    """Marks the consultation behind a Paystack transaction as paid. Safe to
    call repeatedly (webhook redelivery + client-side verify)."""
    reference = data.get('reference')
    consultation_id = _as_uuid(charge_metadata(data).get('consultation_id'))

    with transaction.atomic():
        qs = PartnerConsultation.objects.select_for_update()
        consultation = qs.filter(id=consultation_id).first() if consultation_id else None
        if consultation is None and reference:
            consultation = qs.filter(reference=reference).first()
        if consultation is None:
            logger.error('Partner charge %s matches no consultation.', reference)
            return None

        if data.get('status') != 'success':
            return consultation

        paid_kobo = int(data.get('amount') or 0)
        if paid_kobo < to_kobo(consultation.amount) or (data.get('currency') or 'NGN') != consultation.currency:
            logger.error(
                'Partner charge %s underpaid/mismatched: got %s %s, expected %s %s.',
                reference, paid_kobo, data.get('currency'), to_kobo(consultation.amount), consultation.currency,
            )
            return consultation

        if consultation.status == ConsultationStatus.PENDING_PAYMENT:
            consultation.status = ConsultationStatus.PAID
            consultation.paid_at = timezone.now()
            consultation.reference = reference
            consultation.payment_data = {
                key: data.get(key)
                for key in ('id', 'reference', 'amount', 'currency', 'channel', 'paid_at', 'fees')
            }
            consultation.save()
        elif consultation.reference != reference:
            logger.error(
                'Consultation %s was paid twice (references %s and %s); refund one on Paystack.',
                consultation.id, consultation.reference, reference,
            )
    return consultation


def verify_payment(consultation: PartnerConsultation):
    data = paystack.verify_transaction(consultation.reference)
    apply_successful_charge(data)
    consultation.refresh_from_db()
    return consultation


# --- Calls --------------------------------------------------------------------

def _exclusive_doctor_partners():
    """doctor id -> ids of the partners that doctor is exclusive to."""
    exclusive = {}
    for doctor_id, partner_id in PartnerService.objects.filter(
        partner__is_active=True,
        partner__exclusive_doctors=True,
        doctors__isnull=False,
    ).values_list('doctors', 'partner_id'):
        exclusive.setdefault(str(doctor_id), set()).add(partner_id)
    return exclusive


def exclusive_doctor_ids():
    return set(_exclusive_doctor_partners())


def hidden_doctor_ids_for(user):
    """Partner-exclusive doctors this user may not see or book."""
    partner = get_partner_for(user) if user.is_authenticated else None
    return {
        doctor_id
        for doctor_id, partner_ids in _exclusive_doctor_partners().items()
        if partner is None or partner.id not in partner_ids
    }


def visible_doctors_by_caller(doctor_ids, caller_ids):
    """Per caller, the online doctors they may see: partner-exclusive doctors
    are only listed to patients of that partner."""
    exclusive = _exclusive_doctor_partners()
    caller_uuids = [uid for uid in map(_as_uuid, caller_ids) if uid]
    partner_of = {
        str(user_id): partner_id
        for user_id, partner_id in PartnerMembership.objects.filter(
            user_id__in=caller_uuids
        ).values_list('user_id', 'partner_id')
    }
    return {
        caller_id: [
            doctor_id for doctor_id in doctor_ids
            if doctor_id not in exclusive or partner_of.get(str(caller_id)) in exclusive[doctor_id]
        ]
        for caller_id in caller_ids
    }


def check_call_allowed(caller_id, doctor_id, consultation_id=None):
    """Returns the paid consultation a call is billed to (or None for a regular
    wallet call). Raises PartnerCallError when the call isn't allowed."""
    if consultation_id:
        consultation = (
            PartnerConsultation.objects.select_related('service')
            .filter(id=_as_uuid(consultation_id), user_id=caller_id)
            .first()
        ) if _as_uuid(consultation_id) else None
        if consultation is None:
            raise PartnerCallError('Consultation not found.')
        if consultation.status != ConsultationStatus.PAID:
            raise PartnerCallError('This consultation is not paid for, or has already been used.')
        if not consultation.service.doctors.filter(id=doctor_id).exists():
            raise PartnerCallError('This doctor is not available for this service.')
        return consultation

    if str(doctor_id) in exclusive_doctor_ids():
        raise PartnerCallError('This doctor only takes paid partner consultations.')
    return None


def complete_consultation(consultation_id):
    PartnerConsultation.objects.filter(id=consultation_id, status=ConsultationStatus.PAID).update(
        status=ConsultationStatus.COMPLETED, completed_at=timezone.now()
    )


def provision_subaccount(partner):
    """Creates (or updates) the partner's Paystack subaccount from its
    settlement details. percentage_charge only matters as a fallback — each
    checkout sets transaction_charge explicitly."""
    payload = {
        'business_name': partner.name,
        'settlement_bank': partner.settlement_bank_code,
        'account_number': partner.settlement_account_number,
        'percentage_charge': float(partner.commission_percent),
        'primary_contact_email': partner.contact_email or None,
        'primary_contact_phone': partner.contact_phone or None,
    }
    payload = {key: value for key, value in payload.items() if value not in (None, '')}
    if partner.paystack_subaccount_code:
        data = paystack.update_subaccount(partner.paystack_subaccount_code, payload)
    else:
        if not (partner.settlement_bank_code and partner.settlement_account_number):
            raise PartnerConfigError('Set the settlement bank code and account number first.')
        data = paystack.create_subaccount(payload)
    partner.paystack_subaccount_code = data.get('subaccount_code') or partner.paystack_subaccount_code
    partner.settlement_account_name = data.get('account_name') or partner.settlement_account_name
    partner.save(update_fields=['paystack_subaccount_code', 'settlement_account_name', 'updated_at'])
    return partner
