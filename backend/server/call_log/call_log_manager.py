
from typing import Literal, TypedDict, Optional, Union, Dict, Any
from .models import CallLog, CallStatus
from .serializers import CallLogSerializer

class CallLogDataType(TypedDict):
    id: str
    health_care_assistant: str
    doctor: str
    start_time: str
    end_time: Optional[str]
    status: str
    call_type: str
    notes: Optional[str]
    duration: Optional[int]
    call_data: Optional[Dict[str, Union[str, int, float, bool]]]
    priority: int

OutMessageNameType = Literal[
    "NOTIFY-PERSONNEL-CLIENT-NEW-CONNECTION", 
    "NOTIFY-PERSONNEL-CLIENT-DOCTOR-ENDED-CALL", 
    "NOTIFY-PERSONNEL-CLIENT-DOCTOR-DECLINED-CALL", 
    "NOTIFY-PERSONNEL-CLIENT-DOCTOR-ANSWERED-CALL",
    "NOTIFY-PERSONNEL-CLIENT-DOCTOR-IS-BUSY",
    "NOTIFY-DOCTOR-CLIENT-INCOMING-CALL"
]

class OutMessageType(TypedDict):
    name: OutMessageNameType
    data: Union[CallLogDataType, Any]

class CallLogManager():
    
    def __init__(self, data: Union[CallLogDataType, None], *args, **kwargs):
        try:
            self.call_log = CallLog.objects.get(id=data["id"]) if data else None
        except CallLog.DoesNotExist:
            self.call_log = None
            
    def setCallLog(self, call_log: CallLog):
        self.call_log = call_log
    
    def toDict(self) -> CallLogDataType:
        return CallLogSerializer(self.call_log, many=False).data
    
    def composeMessage(self, name: OutMessageNameType) -> OutMessageType:
        return {
            "name": name,
            "data": self.toDict()
        }
        
    def isDoctorBusy(self):
        search = CallLog.objects.filter(doctor_id=self.call_log.doctor.pk, status=CallStatus.IN_PROGRESS)
        return search.exists()