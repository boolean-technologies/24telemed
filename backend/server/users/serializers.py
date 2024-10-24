from rest_framework import serializers
from .models import User
from  rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from wallet.models import Wallet
from file.models import File

class WalletSerializer(serializers.ModelSerializer):
    call_session = serializers.SerializerMethodField()
    call_unit_cost = serializers.SerializerMethodField()

    class Meta:
        model = Wallet
        fields = '__all__'

    def get_call_session(self, obj: Wallet) -> int:
        return obj.get_call_session()

    def get_call_unit_cost(self, obj: Wallet) -> float:
        return obj.get_call_unit_cost()

class UserSerializer(serializers.ModelSerializer):
    photo = serializers.PrimaryKeyRelatedField(queryset=File.objects.all(), required=False)
    patient_id = serializers.SerializerMethodField()
    covered_by_insurance = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        exclude = ['password']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.photo:
            representation['photo'] = instance.photo.file.url
        else:
            representation['photo'] = None
        
        return representation

    def update(self, instance, validated_data):
        if 'photo' in validated_data:
            photo_data = validated_data.pop('photo')
            if isinstance(photo_data, File):
                instance.photo = photo_data
            else:
                instance.photo = None
        return super().update(instance, validated_data)

    def get_patient_id(self, obj: User):
        try:
            return str(obj.patient_profile.first().id) if (obj.patient_profile) else None
        except:
            return None
    
    def get_covered_by_insurance(self, obj: User) -> bool:
        return obj.insurance_coverage != None
    

class CurrentUserSerializer(UserSerializer):
    wallet = WalletSerializer(read_only=True)
    
    class Meta:
        model = User
        exclude = ['password']
    

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
