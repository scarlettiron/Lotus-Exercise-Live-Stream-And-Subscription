import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import thread


@database_sync_to_async
def verify_user(requesting_user, thread_id):
    try:
        Thread = thread.objects.get(pk = thread_id)
        if Thread.user1 == requesting_user or Thread.user2 == requesting_user:
            return True
    except:
        return False 

class PrivateCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('private call consumer')
        self.user = self.scope['user']
        self.room_name = self.scope['url_route']['kwargs']['call_name']
        self.room_group_name = 'privatevideocall_%s' % self.room_name

        #verify that user is a thread member
            # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        caller = text_data_json['caller']
        thread = text_data_json['thread']
        signal = text_data_json['candidateSignal']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': type,
                'caller':caller,
                'thread':thread,
                'candidateSignal':signal
            }
        )

    # Receive message from room group
    async def ice_candidate(self, event):
        type = event['type']
        caller = event['caller']
        thread = event['thread']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': type,
            'caller':caller,
            'thread ':thread,
        }))
        
    async def call_signal(self, event):
        print('callSignal')
        type = event['type']
        caller = event['caller']
        thread = event['thread']
        signal = event['candidateSignal']
        
        await self.send(text_data=json.dumps({
            'type': type,
            'caller':caller,
            'thread ':thread,
            'candidateSignal':signal
        }))