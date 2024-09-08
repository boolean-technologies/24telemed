from rest_framework import serializers
from .models import Wallet, Transaction

class WalletSerializer(serializers.ModelSerializer):
    transactions = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ['user', 'balance', 'currency', 'created_at', 'transactions']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['wallet', 'transaction_type', 'amount', 'description', 'created_at']