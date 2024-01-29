import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CallLogWebSocketConsumer(AsyncWebsocketConsumer):
    connected_clients = set()

    async def connect(self):
        await self.accept()
        # self.connected_clients.add(self.channel_name)
        await self.send("I see you")

    async def disconnect(self, close_code):
        pass
        # self.connected_clients.discard(self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        # if 'initiate_call' in data:
        print(data)
        # await self.send(text_data=json.dumps({"message": data}))