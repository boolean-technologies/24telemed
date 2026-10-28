from datetime import date

from django.db import transaction
from rest_framework import serializers

from patient.models import Gender, Patient
from users.models import User
from .models import Partner, PartnerConsultation, PartnerMembership, PartnerService


class PartnerDoctorSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'specialty', 'photo']

    def get_photo(self, obj):
        if not obj.photo or not obj.photo.file:
            return None
        return obj.photo.file.url


class PartnerServiceSerializer(serializers.ModelSerializer):
    doctors = serializers.SerializerMethodField()

    class Meta:
        model = PartnerService
        fields = ['id', 'name', 'description', 'fee', 'currency', 'doctors']

    def get_doctors(self, obj):
        doctors = obj.doctors.filter(user_type='doctor', is_verified=True, is_active=True)
        return PartnerDoctorSerializer(doctors, many=True).data


class PartnerSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = [
            'id', 'name', 'slug', 'tagline', 'description', 'logo_url',
            'contact_email', 'contact_phone', 'services',
        ]

    def get_services(self, obj):
        services = obj.services.filter(is_active=True).prefetch_related('doctors')
        return PartnerServiceSerializer(services, many=True).data


class PartnerRegistrationSerializer(serializers.Serializer):
    """Sign-up for a partner's patient: a `customer` user tagged with the
    partner, plus the patient profile calls are attached to."""

    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    date_of_birth = serializers.DateField()
    gender = serializers.ChoiceField(choices=Gender.choices)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('That username is already taken.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate_phone_number(self, value):
        if Patient.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError('A patient with this phone number already exists.')
        return value

    def validate_date_of_birth(self, value):
        if value >= date.today():
            raise serializers.ValidationError('Enter a valid date of birth.')
        return value

    @transaction.atomic
    def create(self, validated_data):
        partner = self.context['partner']
        dob = validated_data['date_of_birth']
        today = date.today()
        user = User(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            date_of_birth=dob,
            user_type='customer',
            is_verified=True,
        )
        user.set_password(validated_data['password'])
        user.save()
        PartnerMembership.objects.create(user=user, partner=partner)
        Patient.objects.create(
            user=user,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            phone_number=user.phone_number,
            date_of_birth=dob,
            age=today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day)),
            gender=validated_data['gender'],
        )
        return user


class PartnerConsultationSerializer(serializers.ModelSerializer):
    service_detail = PartnerServiceSerializer(source='service', read_only=True)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = PartnerConsultation
        fields = [
            'id', 'service', 'service_detail', 'patient', 'reason', 'amount', 'currency',
            'status', 'reference', 'paid_at', 'completed_at', 'created_at',
        ]
        read_only_fields = fields


class PartnerConsultationCreateSerializer(serializers.Serializer):
    service = serializers.PrimaryKeyRelatedField(queryset=PartnerService.objects.filter(is_active=True))
    reason = serializers.CharField(required=False, allow_blank=True, max_length=2000)

    def validate_service(self, service):
        if service.partner_id != self.context['partner'].id:
            raise serializers.ValidationError('This service is not offered by your clinic.')
        return service
