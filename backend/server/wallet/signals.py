from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Transaction

@receiver(post_save, sender=Transaction)
def update_wallet_balance(sender, instance: Transaction, created, **kwargs):
    """Update the wallet balance when a transaction is created."""
    if created:
        wallet = instance.wallet
        amount = instance.amount
        try:
            if instance.transaction_type == 'deposit':
                wallet.deposit(amount)
            elif instance.transaction_type == 'withdrawal':
                wallet.withdraw(amount)
            elif instance.transaction_type == 'transfer':
                wallet.withdraw(amount)
            wallet.save()
        except ValueError as e:
            raise ValueError(f"Transaction failed: {str(e)}")
