from rest_framework import serializers
from .models import User, Wallet
from  rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['account_number', 'bank_name', 'flw_ref', 'order_ref', 'amount', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    patient_id = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'user_id', 'patient_id', 'first_name', 'last_name', 'email', 'phone_number', 'bvn']
        
    def get_patient_id(self, obj):
        try:
            return str(obj.patient_profile.first().id) if (obj.patient_profile) else None
        except:
            return None


class CurrentUserSerializer(UserSerializer):
    wallet = WalletSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'user_id', 'patient_id', 'first_name', 'last_name', 'email', 'phone_number', 'bvn', 'wallet']
    

class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'user_id', 'first_name', 'last_name', 'username', 'photo']

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'user_id', 'first_name', 'last_name', 'username', 'photo', 'specialty']

class DoctorTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.user_type != 'doctor':
            raise serializers.ValidationError("Invalid credentials for doctor login.")

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data

class PersonnelTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.user_type not in ['customer', 'personnel']:
            raise serializers.ValidationError("Invalid credentials for login.")

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data


class WalletAccountSerializer(serializers.Serializer):
    response_code = serializers.CharField(max_length=10)
    response_message = serializers.CharField(max_length=255)
    flw_ref = serializers.CharField(max_length=100)
    order_ref = serializers.CharField(max_length=100)
    account_number = serializers.CharField(max_length=20)
    frequency = serializers.CharField(max_length=10)
    bank_name = serializers.CharField(max_length=100)
    created_at = serializers.DateTimeField()
    expiry_date = serializers.DateTimeField()
    note = serializers.CharField(max_length=255)
    amount = serializers.FloatField()