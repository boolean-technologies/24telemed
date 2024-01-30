# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class CallLogWebSocketConsumer(AsyncWebsocketConsumer):
#     connected_clients = set()

#     async def connect(self):
#         await self.accept()
#         # self.connected_clients.add(self.channel_name)
#         await self.send("I see you")

#     async def disconnect(self, close_code):
#         pass
#         # self.connected_clients.discard(self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         # if 'initiate_call' in data:
#         print(data)
#         # await self.send(text_data=json.dumps({"message": data}))

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CallLogWebSocketConsumer(AsyncWebsocketConsumer):
    connected_users = []

    async def connect(self):
        await self.accept()
        connection = {
            "user_id": "",
            "channel_name": self.channel_name
        }
        self.connected_users.append(connection)
        print(f"WebSocket connected, channel_name: {self.channel_name}")
        await self.send_connected_users()

    async def disconnect(self, close_code):
        self.connected_users = [user for user in self.connected_users if user['channel_name'] != self.channel_name]
        await self.send_connected_users()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)

            if 'initiate_call' in data:
                await self.initiate_call(data['initiate_call'])
        except KeyError:
            pass

    async def initiate_call(self, data):
        try:
            doctor_channel_name = data['doctor_channel_name']
            note = data['note']
            priority = data['priority']
            health_care_assistant_channel_name = data.get('health_care_assistant_channel_name')

            # Broadcast the initiation to the doctor
            await self.channel_layer.send(
                doctor_channel_name,
                {
                    'type': 'call_initiated',
                    'note': note,
                    'priority': priority,
                    'health_care_assistant_channel_name': health_care_assistant_channel_name,
                }
            )

            # Broadcast the initiation to the health care assistant
            if health_care_assistant_channel_name:
                await self.channel_layer.send(
                    health_care_assistant_channel_name,
                    {
                        'type': 'call_initiated',
                        'note': note,
                        'priority': priority,
                        'doctor_channel_name': doctor_channel_name,
                    }
                )
                
            # Add doctor and health care assistant to the list
            self.connected_users.append({'channel_name': doctor_channel_name, 'role': 'doctor'})
            if health_care_assistant_channel_name:
                self.connected_users.append({'channel_name': health_care_assistant_channel_name, 'role': 'health_care_assistant'})
            await self.send_connected_users()
        except Exception as e:
            print(f"Error in initiate_call: {e}")
        
    async def send_connected_users(self):
        # Prepare a message with the list of connected users and their channel names
        message = {
            'type': 'connected_users',
            'data': self.connected_users,
        }
        # Send the message to all clients
        await self.send(text_data=json.dumps(message))