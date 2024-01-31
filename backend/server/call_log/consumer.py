import json
from typing import Literal, TypedDict, List, Optional, Union, Dict, Callable, Any
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import CallLog
from .call_log_manager import CallLogManager, CallLogDataType, OutMessageType


class ConnectedChannel(TypedDict):
    user_id: str
    channel_name: str
    type: Literal["doctor", "health-care-assistant"]
    
class CallADoctorType(TypedDict):
    doctor_id: str 
    note: Optional[str]
    priority: int


InMessageNameType = Literal[
    "NOTIFY-SERVER-END-CALL", 
    "NOTIFY-SERVER-DECLINE-CALL", 
    "NOTIFY-SERVER-ANSWER-CALL", 
    "NOTIFY-SERVER-CALL-A-DOCTOR"
]
    
class InMessageType(TypedDict):
    name: InMessageNameType
    data: Union[CallADoctorType, CallLogDataType]
    note: Optional[str]

class CallLogWebSocketConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.connected_clients: List[ConnectedChannel] = []

    async def connect(self):
        user_id = self.scope['url_route']['kwargs'].get('user_id', '')
        type = self.scope['url_route']['kwargs'].get('type', 'doctor') 
        
        # Check if 'user_id' and 'type' are provided
        if not user_id or not type:
            await self.close(code=4000, text="Missing 'user_id' or 'type' in connection parameters.")
            return
        
        await self.accept()
        connection: ConnectedChannel = {
            "user_id": user_id,
            "type": type,
            "channel_name": self.channel_name
        }
        self.connected_clients.append(connection)
        
        if connection["type"] == "doctor":
            await self.send_connected_clients()

    async def disconnect(self, close_code):
        self.connected_clients = [user for user in self.connected_clients if user["channel_name"] != self.channel_name]
        await self.send_connected_clients()

    async def receive(self, text_data):
        try:
            message: InMessageType = json.loads(text_data)
            messageName = message["name"]

            # Define a dictionary mapping message names to their handlers
            message_handlers: Dict[InMessageNameType, Callable[[Union[CallADoctorType, CallLogDataType]], None]] = {
                "NOTIFY-SERVER-CALL-A-DOCTOR": self.handleCallDoctor,
                "NOTIFY-SERVER-DECLINE-CALL": self.handleDeclineCall,
                "NOTIFY-SERVER-ANSWER-CALL": self.handleAnswerCall,
                "NOTIFY-SERVER-END-CALL": self.handleEndCall,
            }

            # Call the appropriate handler based on the message name
            if messageName in message_handlers:
                handler = message_handlers[messageName]
                data = message["data"]
                handler(data)

            print(message)
        except KeyError:
            pass


    # TODO: Modify this to send to only health care personnel
    async def send_connected_clients(self):
        message: OutMessageType = {
            'name': "NEW-CONNECTION",
            'data': self.connected_clients,
        }
        await self.send(text_data=json.dumps(message))
        
    
    async def sendNotification(self, channel_name: str, message: OutMessageType):
        await self.channel_layer.send(channel_name, message)
    
    def get_call_log(self, data: CallLogDataType) -> CallLog:
        call_log = CallLog.objects.get(id = data["id"])
        return call_log
    
    def getConnectionByUserId(self, user_id: str) -> Optional[ConnectedChannel]:
        connections = [conn for conn in self.connected_clients if conn['user_id'] == user_id]
        return connections[0] if connections else None
    
    def getConnectionByChannelName(self, channel_name: str) -> Optional[ConnectedChannel]:
        connections = [conn for conn in self.connected_clients if conn['channel_name'] == channel_name]
        return connections[0] if connections else None

    
    async def handleCallDoctor(self, data: CallADoctorType):
        # Process CallADoctorType data
        healthCareAssistantConnection = self.getConnectionByChannelName(self.channel_name)
        call_log = CallLog.objects.create(
            doctor_id = data["doctor_id"],
            health_care_assistant = healthCareAssistantConnection["user_id"],
            notes = data["note"],
            priority = data["priority"]
        )
        call_log_manager = CallLogManager(None)
        call_log_manager.setCallLog(call_log)
        
        if call_log_manager.isDoctorBusy():
            call_log_manager.call_log.setToBusy()
            message = call_log_manager.composeMessage("NOTIFY-PERSONNEL-CLIENT-DOCTOR-IS-BUSY")
            await self.sendNotification(healthCareAssistantConnection["channel_name"], message)
        else:
            message = call_log_manager.composeMessage("NOTIFY-DOCTOR-CLIENT-INCOMING-CALL") 
            doctorConnection = self.getConnectionByUserId(str(call_log.doctor.pk))
            await self.sendNotification(doctorConnection["channel_name"], message)
        
    async def handleDeclineCall(self, data: CallLogDataType):
        # Process CallLogDataType data
        try:
            call_log_manager = CallLogManager(data)
            call_log_manager.call_log.setToDeclined()
            message = call_log_manager.composeMessage("NOTIFY-PERSONNEL-CLIENT-DOCTOR-DECLINED-CALL")
            connection = self.getConnectionByUserId(str(call_log_manager.call_log.health_care_assistant.pk))
            await self.sendNotification(connection["channel_name"], message)
        except:
            pass 

    async def handleAnswerCall(self, data: CallLogDataType):
        # Process CallLogDataType data
        try:
            call_log_manager = CallLogManager(data)
            call_log_manager.call_log.setToInProgress()
            message = call_log_manager.composeMessage("NOTIFY-PERSONNEL-CLIENT-DOCTOR-ANSWERED-CALL")
            connection = self.getConnectionByUserId(str(call_log_manager.call_log.health_care_assistant.pk))
            await self.sendNotification(connection["channel_name"], message)
        except:
            pass 

    async def handleEndCall(self, data: CallLogDataType):
        # Process CallLogDataType data
        try:
            call_log_manager = CallLogManager(data)
            call_log_manager.call_log.setToCompleted()
            message = call_log_manager.composeMessage("NOTIFY-PERSONNEL-CLIENT-DOCTOR-ENDED-CALL")
            connection = self.getConnectionByUserId(str(call_log_manager.call_log.health_care_assistant.pk))
            await self.sendNotification(connection["channel_name"], message)
        except:
            pass 