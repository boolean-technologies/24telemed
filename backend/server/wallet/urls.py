from django.urls import path
from .views import TransactionListView, FlutterwaveWebhookView, PaystackWebhookView

urlpatterns = [
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('webhook/flutterwave/', FlutterwaveWebhookView.as_view(), name='flutterwave-webhook'),
    path('webhook/paystack/', PaystackWebhookView.as_view(), name='paystack-webhook'),
]