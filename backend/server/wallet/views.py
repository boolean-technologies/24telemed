import json
import hmac
import hashlib
from django.conf import settings
from django.http import JsonResponse
from rest_framework.permissions import AllowAny

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, Transaction
from .serializers import TransactionSerializer


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        wallet = Wallet.objects.get(user=self.request.user)
        return Transaction.objects.filter(wallet=wallet)


class FlutterwaveWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            payload = json.loads(request.body)
            event = payload.get('event')
            
            if not self.verify_signature(request):
                return JsonResponse({'status': 'error', 'message': 'Invalid signature'}, status=403)

            if event == 'charge.completed':
                flw_ref = payload['data']['flw_ref'] 
                status = payload['data']['status']
                amount = payload['data']['amount']
                currency = payload['data']['currency']
                user_email = payload['data']['customer']['email']
                
                if status == 'successful':
                    try:
                        wallet = Wallet.objects.get(user__email=user_email)
                        Transaction.objects.create(
                            wallet=wallet,
                            transaction_type='deposit',
                            amount=amount,
                            description=f'Flutterwave payment - {flw_ref}'
                        )

                        return JsonResponse({'status': 'success', 'message': 'Wallet updated successfully'}, status=200)
                    
                    except Wallet.DoesNotExist:
                        return JsonResponse({'status': 'error', 'message': 'Wallet not found'}, status=404)
                else:
                    return JsonResponse({'status': 'error', 'message': 'Payment not successful'}, status=400)
            
            return JsonResponse({'status': 'error', 'message': 'Invalid event type'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)

    def verify_signature(self, request):
        """Verify Flutterwave webhook signature."""
        secret = settings.FLUTTERWAVE_SECRET_KEY
        signature = request.headers.get('verif-hash')

        # Compute the hash for comparison
        computed_signature = hmac.new(
            secret.encode(), request.body, hashlib.sha256
        ).hexdigest()

        return signature == computed_signature


@method_decorator(csrf_exempt, name='dispatch')
class PaystackWebhookView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        try:
            payload = json.loads(request.body)
            event = payload.get('event')

            if not self.verify_signature(request):
                return JsonResponse({'status': 'error', 'message': 'Invalid signature'}, status=403)

            if event == 'charge.success':
                reference = payload['data']['reference']
                amount = payload['data']['amount'] / 100
                status = payload['data']['status']
                currency = payload['data']['currency']
                user_email = payload['data']['customer']['email']

                if status == 'success':
                    try:
                        wallet = Wallet.objects.get(user__email=user_email)
                        Transaction.objects.create(
                            wallet=wallet,
                            transaction_type='deposit',
                            amount=amount,
                            description=f'Wallet top-up: {reference}'
                        )
                        return JsonResponse({'status': 'success', 'message': 'Wallet updated successfully'}, status=200)

                    except Wallet.DoesNotExist:
                        return JsonResponse({'status': 'error', 'message': 'Wallet not found'}, status=404)
                else:
                    return JsonResponse({'status': 'error', 'message': 'Payment not successful'}, status=400)

            return JsonResponse({'status': 'error', 'message': 'Invalid event type'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)

    def verify_signature(self, request):
        """Verify Paystack webhook signature."""
        secret = settings.PAYSTACK_SECRET_KEY
        signature = request.headers.get('x-paystack-signature')

        computed_signature = hmac.new(
            secret.encode(), request.body, hashlib.sha512
        ).hexdigest()

        return signature == computed_signature