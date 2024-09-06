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