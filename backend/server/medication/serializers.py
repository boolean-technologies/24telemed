from rest_framework import serializers
from .models import Drug, PrescribedDrug, MedicalEncounter

class DrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drug
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PrescribedDrugSerializer(serializers.ModelSerializer):
    drug_detail = DrugSerializer(source='drug', read_only=True)

    class Meta:
        model = PrescribedDrug
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class MedicalEncounterSerializer(serializers.ModelSerializer):
    prescribed_drugs = PrescribedDrugSerializer(many=True, read_only=True)
    doctor_name = serializers.SerializerMethodField()
    class Meta:
        model = MedicalEncounter
        fields = '__all__'
        read_only_fields = ['id', 'doctor', 'created_at', 'updated_at']

    def get_doctor_name(self, obj: MedicalEncounter) -> str:
        if obj.doctor:
            return obj.doctor.get_full_name()
        return ''


class PrescribeDrugSerializer(serializers.Serializer):
    drug_name = serializers.CharField(max_length=100)
    dosage = serializers.CharField(max_length=250)
    frequency = serializers.CharField(max_length=250)
    duration = serializers.CharField(max_length=100, required=False, allow_blank=True)
    instructions = serializers.CharField(required=False, allow_blank=True)
