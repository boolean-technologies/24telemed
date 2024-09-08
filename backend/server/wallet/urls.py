from django.urls import path
from .views import (
    WalletDetailView, 
    TransactionListView, 
    FlutterwaveWebhookView
)

urlpatterns = [
    path('wallet/', WalletDetailView.as_view(), name='wallet-detail'),
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('webhook/flutterwave/', FlutterwaveWebhookView.as_view(), name='flutterwave-webhook'),
]