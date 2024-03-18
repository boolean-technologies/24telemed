import os
import requests
from asgiref.sync import sync_to_async
from typing import Literal, TypedDict, Optional, Union, Dict, Any
from .models import CallLog, CallStatus, CallPriority
from .serializers import CallLogSerializer
from uuid import UUID
import json

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
    "NOTIFY_PERSONNEL_CLIENT_NEW_CONNECTION", 
    "NOTIFY_PERSONNEL_CLIENT_DOCTOR_ENDED_CALL", 
    "NOTIFY_PERSONNEL_CLIENT_DOCTOR_DECLINED_CALL", 
    "NOTIFY_PERSONNEL_CLIENT_DOCTOR_ANSWERED_CALL",
    "NOTIFY_PERSONNEL_CLIENT_DOCTOR_IS_BUSY",
    "NOTIFY_DOCTOR_CLIENT_INCOMING_CALL"
]

class OutMessageType(TypedDict):
    name: OutMessageNameType
    data: Union[CallLogDataType, Any]
    note: Optional[Any]

class CallLogManager():
    
    async def setUpModel(self, data: Union[CallLogDataType, None]):
        try:
            self.serializedData = data 
            def getCallLog():
                return CallLog.objects.get(id=data["id"]) if data else None
            self.call_log = await sync_to_async(getCallLog)()
        except CallLog.DoesNotExist:
            self.call_log = None
            
    def setCallLog(self, call_log: CallLog):
        self.call_log = call_log
        self.serializedData = self.toDict() 
    
    def toDict(self) -> CallLogDataType:
        data = CallLogSerializer(self.call_log, many=False).data
        
        if isinstance(data["health_care_assistant"], UUID):
            data["health_care_assistant"] = str(data["health_care_assistant"])
            
        if isinstance(data["doctor"], UUID):
            data["doctor"] = str(data["doctor"])
            
        if isinstance(data["patient"], UUID):
            data["patient"] = str(data["patient"])
        
        return data
    
    def composeMessage(self, name: OutMessageNameType) -> OutMessageType:
        return {
            "type": name,
            "data": self.toDict()
        }
        
    async def isDoctorBusy(self):
        def isDoctorBusy():
            search = CallLog.objects.filter(doctor_id=self.call_log.doctor.pk, status=CallStatus.IN_PROGRESS)
            return search.exists()
        return await sync_to_async(isDoctorBusy)()
    
    async def createCallLog(self, data, health_care_assistant_id):
        def createCallLog():
            return CallLog.objects.create(
                doctor_id = data["doctorId"],
                patient_id = data["patientId"],
                health_care_assistant_id = health_care_assistant_id,
                notes = data["note"] if (data["note"]) else None,
                priority = data["priority"] if data["priority"] else CallPriority.MEDIUM,
            )
        result = await sync_to_async(createCallLog)()
        self.call_log = result
        return result
    
    async def setToBusy(self):
        await sync_to_async(self.call_log.setToBusy)()

    async def setToFailed(self):
        await sync_to_async(self.call_log.setToFailed)()

    async def setToInProgress(self):
        await sync_to_async(self.call_log.setToInProgress)()

    async def setToCompleted(self):
        await sync_to_async(self.call_log.setToCompleted)()

    async def setToDeclined(self, decline_note = None):
        await sync_to_async(self.call_log.setToDeclined)(decline_note)
        
    
    async def setUpVideoSDKMeeting(self) -> bool:
        url = "https://api.videosdk.live/v2/rooms"
        token = os.getenv('VIDEO_SDK_TOKEN')
        headers = {'Authorization' : token,'Content-Type' : 'application/json'}
        request = requests.request("POST", url, json = { "customRoomId" : str(self.serializedData["id"]) }, headers = headers)
        response = json.loads(request.text)
        roomId = response.get("roomId", None)
        await sync_to_async(self.call_log.setMeetingId)(roomId)
        return True