from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from wallet.models import Wallet

@receiver(post_save, sender=User)
def create_user_wallet(sender, instance, created, **kwargs):
    if not hasattr(instance, 'wallet'):
        Wallet.objects.create(user=instance, balance=0)
