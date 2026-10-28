"""Minimal Paystack REST client for split payments (subaccounts)."""
import requests
from django.conf import settings

BASE_URL = 'https://api.paystack.co'
TIMEOUT = 20


class PaystackError(Exception):
    pass


def _call(method, path, **kwargs):
    secret = settings.PAYSTACK_SECRET_KEY
    if not secret:
        raise PaystackError('PAYSTACK_SECRET_KEY is not configured.')
    try:
        response = requests.request(
            method,
            f'{BASE_URL}{path}',
            headers={'Authorization': f'Bearer {secret}', 'Content-Type': 'application/json'},
            timeout=TIMEOUT,
            **kwargs,
        )
        body = response.json()
    except (requests.RequestException, ValueError) as exc:
        raise PaystackError(f'Could not reach Paystack: {exc}') from exc
    if not response.ok or not body.get('status'):
        raise PaystackError(body.get('message') or f'Paystack error ({response.status_code})')
    return body.get('data')


def initialize_transaction(payload):
    return _call('POST', '/transaction/initialize', json=payload)


def verify_transaction(reference):
    return _call('GET', f'/transaction/verify/{reference}')


def create_subaccount(payload):
    return _call('POST', '/subaccount', json=payload)


def update_subaccount(code, payload):
    return _call('PUT', f'/subaccount/{code}', json=payload)
