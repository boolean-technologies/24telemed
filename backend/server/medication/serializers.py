from rest_framework import serializers
from .models import Drug, PrescribedDrug, MedicalEncounter

class DrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drug
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PrescribedDrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescribedDrug
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class MedicalEncounterSerializer(serializers.ModelSerializer):
    prescribed_drugs = PrescribedDrugSerializer(many=True)
    doctor_name = serializers.SerializerMethodField()
    class Meta:
        model = MedicalEncounter
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_doctor_name(self, obj: MedicalEncounter) -> str:
        if obj.doctor:
            return obj.doctor.get_full_name()
        return ''