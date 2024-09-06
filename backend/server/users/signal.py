from django.db.models.signals import post_save
from django.dispatch import receiver
from utils.flutterwave import create_virtual_account
from .models import User, Wallet

@receiver(post_save, sender=User)
def create_user_wallet(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'wallet'):
        wallet_data = create_virtual_account(instance)
        if wallet_data:
            Wallet.objects.create(
                user=instance,
                account_number=wallet_data['data']['account_number'],
                bank_name=wallet_data['data']['bank_name'],
                flw_ref=wallet_data['data']['flw_ref'],
                order_ref=wallet_data['data']['order_ref'],
                note=wallet_data['data']['note'],
                amount=wallet_data['data']['amount']
            )