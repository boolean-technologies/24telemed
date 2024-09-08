import requests
import json
from django.conf import settings
from users.models import User

class FlutterwaveAPI:
    base_url = 'https://api.flutterwave.com/v3/virtual-account-numbers'
    secret_key = settings.FLUTTERWAVE_SECRET_KEY
    headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {secret_key}'
        }

    @staticmethod
    def create_virtual_account(user: User):
        url = FlutterwaveAPI.base_url
        data = {
            "email": user.email,
            "is_permanent": True,
            "bvn": user.bvn,
            "tx_ref": str(user.id),
            "phonenumber": user.phone_number,
            "firstname": user.first_name,
            "lastname": user.last_name,
            "narration": str(user.id)
        }
        response = requests.post(url, headers=FlutterwaveAPI.headers, data=json.dumps(data))
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to create wallet: {response.text}")

    @staticmethod
    def get_virtual_account(account_number: str):
        url = f'{FlutterwaveAPI.base_url}/{account_number}'
        response = requests.get(url, headers=FlutterwaveAPI.headers)
        if response.status_code == 200:
            return response.json()["data"]
        else:
            raise Exception(f"Failed to retrieve virtual account: {response.text}")

create_virtual_account = FlutterwaveAPI.create_virtual_account
