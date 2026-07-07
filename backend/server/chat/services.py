from .models import Conversation


def ensure_conversation(doctor, patient):
    if not doctor or not patient or patient.user_type != 'customer':
        return None
    conversation, _ = Conversation.objects.get_or_create(
        doctor=doctor, patient=patient
    )
    return conversation
