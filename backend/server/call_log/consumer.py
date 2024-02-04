import json
from asgiref.sync import sync_to_async
from urllib.parse import parse_qsl
from typing import Literal, TypedDict, List, Optional, Union, Dict, Callable, Any
from channels.generic.websocket import AsyncWebsocketConsumer
from .call_log_manager import CallLogManager, CallLogDataType, OutMessageType

class ConnectedChannel(TypedDict):
    user_id: str
    channel_name: str
    type: Literal["doctor", "health-care-assistant"]
    
class CallADoctorType(TypedDict):
    doctorId: str 
    note: Optional[str]
    priority: int


InMessageNameType = Literal[
    "NOTIFY-SERVER-END-CALL", 
    "NOTIFY-SERVER-DECLINE-CALL", 
    "NOTIFY-SERVER-ANSWER-CALL", 
    "NOTIFY-SERVER-CALL-A-DOCTOR",
    "NOTIFY-SERVER-DOCTOR-IS-BUSY",
]
    
class InMessageType(TypedDict):
    type: InMessageNameType
    data: Union[CallADoctorType, CallLogDataType]
    note: Optional[str]
    isRoomCreated: Optional[bool]

class CallLogWebSocketConsumer(AsyncWebsocketConsumer):
    # connected_clients: List[ConnectedChannel] = []
    connected_clients: Dict[str, ConnectedChannel] = {}
    

    async def connect(self):
        # TODO: Get userId from session later
        query_params = self.scope['query_string'].decode('utf-8')  # Decode bytes to string
        # Parse query string into dictionary
        parsed_params = dict(parse_qsl(query_params))
        # Get specific query string parameters
        userId = parsed_params.get('userId', '')
        type = parsed_params.get('type', 'doctor')
        # Check if 'userId' and 'type' are provided
        if not userId or not type:
            await self.close(code=4000)
            return
        
        await self.accept()
        connection: ConnectedChannel = {
            "user_id": userId,
            "type": type,
            "channel_name": self.channel_name
        }
        self.userId = userId
        # self.connected_clients.append(connection)
        self.connected_clients[userId] = connection
        print(self.connected_clients.keys())
        
        if connection["type"] == "doctor":
            await self.sendConnectedClients()

    async def disconnect(self, close_code):
        if self.userId:
            del self.connected_clients[self.userId]
        await self.sendConnectedClients()

    async def receive(self, text_data):
        try:
            message: InMessageType = json.loads(text_data)
            messageName = message["type"]

            # Define a dictionary mapping message names to their handlers
            message_handlers: Dict[InMessageNameType, Callable[[Union[CallADoctorType, CallLogDataType]], None]] = {
                "NOTIFY-SERVER-CALL-A-DOCTOR": self.handleCallDoctor,
                "NOTIFY-SERVER-DECLINE-CALL": self.handleDeclineCall,
                "NOTIFY-SERVER-ANSWER-CALL": self.handleAnswerCall,
                "NOTIFY-SERVER-END-CALL": self.handleEndCall,
                "NOTIFY-SERVER-DOCTOR-IS-BUSY": self.handleDoctorIsBusy
            }

            # Call the appropriate handler based on the message name
            if messageName in message_handlers:
                handler = message_handlers[messageName]
                await handler(message)
        except KeyError:
            pass


    # TODO: Modify this to send to only health care personnel
    async def sendConnectedClients(self):
        message: OutMessageType = {
            'name': "NEW-CONNECTION",
            'data': self.connected_clients,
        }
        await self.send(text_data=json.dumps(message))
        
    
    async def sendNotification(self, channel_name: str, message: OutMessageType):
        try:
            await self.channel_layer.send(channel_name, message)
        except Exception as e:
            print("Error: ", str(e))
    
    def getConnectionByUserId(self, user_id: str) -> Optional[ConnectedChannel]:
        connection = self.connected_clients[user_id]
        return connection if connection else None
    
    async def handleCallDoctor(self, message: InMessageType):
        # Process CallADoctorType data
        try:
            data = message["data"]
            healthCareAssistantConnection = self.getConnectionByUserId(self.userId)
            call_log_manager = CallLogManager()
            await call_log_manager.createCallLog(data, healthCareAssistantConnection["user_id"])
            message = call_log_manager.composeMessage("NOTIFY_DOCTOR_CLIENT_INCOMING_CALL")
            doctorConnection = self.getConnectionByUserId(data["doctorId"])
            await self.sendNotification(doctorConnection["channel_name"], message)

        except Exception as e:
            # if call_log_manager:
            #     await call_log_manager.setToFailed()
            error_message = "An error occurred: {}".format(str(e))
            print(error_message)
        
    async def handleDeclineCall(self, message: InMessageType):
        # Process CallLogDataType data
        try:
            data = message["data"]
            note = message["note"]
            call_log_manager = CallLogManager()
            await call_log_manager.setUpModel(data)
            await call_log_manager.setToDeclined()
            message = call_log_manager.composeMessage("NOTIFY_PERSONNEL_CLIENT_DOCTOR_DECLINED_CALL")
            connection = self.getConnectionByUserId(data["health_care_assistant"])
            await self.sendNotification(connection["channel_name"], { **message, "note": note })
        except Exception as e:
            error_message = "An error occurred: {}".format(str(e))
            print(error_message)

    async def handleAnswerCall(self, message: InMessageType):
        # Process CallLogDataType data
        try:
            data = message["data"]
            call_log_manager = CallLogManager()
            await call_log_manager.setUpModel(data)
            await call_log_manager.setToInProgress()
            isRoomCreated = await call_log_manager.setUpVideoSDKMeeting()
            message = call_log_manager.composeMessage("NOTIFY_PERSONNEL_CLIENT_DOCTOR_ANSWERED_CALL")
            message["isRoomCreated"] = isRoomCreated
            connection = self.getConnectionByUserId(data["health_care_assistant"])
            await self.sendNotification(connection["channel_name"], message)
        except Exception as e:
            error_message = "An error occurred: {}".format(str(e))
            print(error_message)

    async def handleDoctorIsBusy(self, message: InMessageType):
        # Process CallLogDataType data
        try:
            data = message["data"]
            call_log_manager = CallLogManager(data)
            await call_log_manager.setToBusy()
            message = call_log_manager.composeMessage("NOTIFY_PERSONNEL_CLIENT_DOCTOR_IS_BUSY")
            connection = self.getConnectionByUserId(self.userId)
            await self.sendNotification(connection["channel_name"], message)
        except:
            pass 

    async def handleEndCall(self, message: InMessageType):
        # Process CallLogDataType data
        try:
            data = message["data"]
            call_log_manager = CallLogManager(data)
            call_log_manager.call_log.setToCompleted()
            message = call_log_manager.composeMessage("NOTIFY_PERSONNEL_CLIENT_DOCTOR_ENDED_CALL")
            connection = self.getConnectionByUserId(str(call_log_manager.call_log.health_care_assistant.pk))
            await self.sendNotification(connection["channel_name"], message)
        except:
            pass 
    
    # Handlers
    async def NOTIFY_DOCTOR_CLIENT_INCOMING_CALL(self, event):
        await self.send(text_data=json.dumps(event))
    
    async def NOTIFY_PERSONNEL_CLIENT_DOCTOR_IS_BUSY(self, event):
        await self.send(text_data=json.dumps(event))
    
    async def NOTIFY_PERSONNEL_CLIENT_DOCTOR_DECLINED_CALL(self, event):
        await self.send(text_data=json.dumps(event))
    
    async def NOTIFY_PERSONNEL_CLIENT_DOCTOR_ANSWERED_CALL(self, event):
        await self.send(text_data=json.dumps(event))
    
    async def NOTIFY_PERSONNEL_CLIENT_DOCTOR_ENDED_CALL(self, event):
        await self.send(text_data=json.dumps(event))
