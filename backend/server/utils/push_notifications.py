import logging

import requests
from django.conf import settings

from users.models import PushDevice

logger = logging.getLogger(__name__)

EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'


def send_push_to_user(
    user,
    *,
    title,
    body,
    data=None,
    channel_id='appointments',
    priority='high',
    ttl=None,
):
    """Send one Expo notification to every active device owned by ``user``."""
    devices = list(user.push_devices.filter(active=True))
    if not devices:
        logger.warning(
            'No active push devices for user %s; skipped "%s"', user.id, title
        )
        return False

    messages = []
    for device in devices:
        message = {
            'to': device.token,
            'title': title,
            'body': body,
            'data': data or {},
            'sound': 'default',
            'priority': priority,
            'channelId': channel_id,
        }
        if ttl is not None:
            message['ttl'] = ttl
        messages.append(message)

    headers = {'Content-Type': 'application/json'}
    access_token = getattr(settings, 'EXPO_PUSH_ACCESS_TOKEN', '')
    if access_token:
        headers['Authorization'] = f'Bearer {access_token}'

    try:
        response = requests.post(
            EXPO_PUSH_URL, json=messages, headers=headers, timeout=10
        )
        response.raise_for_status()
        tickets = response.json().get('data', [])
        accepted = False
        for device, ticket in zip(devices, tickets):
            if ticket.get('status') == 'ok':
                accepted = True
            elif ticket.get('details', {}).get('error') == 'DeviceNotRegistered':
                device.active = False
                device.save(update_fields=['active', 'updated_at'])
                logger.warning(
                    'Deactivated stale push device for user %s (token %s...)',
                    user.id, device.token[:12],
                )
            else:
                logger.warning(
                    'Expo push rejected for user %s: %s', user.id, ticket
                )
        return accepted
    except (requests.RequestException, ValueError) as exc:
        logger.warning('Could not send Expo push notification: %s', exc)
        return False
