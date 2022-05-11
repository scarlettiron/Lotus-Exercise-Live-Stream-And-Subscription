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

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('chat consumers')
        self.user = self.scope['user']
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        #verify that user is a thread member
        verify = verify_user(self.user, self.room_name)
        if verify:
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
        id = text_data_json['id']
        body = text_data_json['body']
        sender = text_data_json['sender']
        thread = text_data_json['thread']
        date = text_data_json['date']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id':id,
                'body': body, 
                'sender':sender,
                'thread':thread,
                'date':date
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        id = event['id']
        body = event['body']
        sender = event['sender']
        thread = event['thread']
        date = event['date']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'id':id,
            'body': body,
            'sender':sender,
            'thread ':thread,
            'date':date
        }))