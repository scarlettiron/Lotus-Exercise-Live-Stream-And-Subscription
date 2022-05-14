import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from booking.models import classSessionId, appointment


''' @database_sync_to_async
def verify_user(requesting_user, thread_id):
    try:
        Thread = thread.objects.get(pk = thread_id)
        if Thread.user1 == requesting_user or Thread.user2 == requesting_user:
            return True
    except:
        return False  '''

class group_class_consumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chatcall_%s' % self.room_name

        #verify that user is a thread member
            # Join room group
        ''' Verify = verify_user(self.user, self.room_name)
        if(Verify): '''
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
        sender = text_data_json['sender']
        thread = text_data_json['thread']
        body = text_data_json['body']
        signal = text_data_json['candidateSignal']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': type,
                'sender':sender,
                'thread':thread,
                'body':body,
                'candidateSignal':signal
            }
        )


    #send a regular text message
    async def chat_message(self, event):
        print('chat_message')
        type = event['type']
        sender = event['sender']
        thread = event['thread']
        body = event['body']
        
        await self.send(text_data=json.dumps({
            'type':type,
            'thread':thread,
            'sender':sender,
            'body':body
        }))
        

    #send call request with peer candidate signal
    async def call_request(self, event):
        print('call request')
        type = event['type']
        thread = event['thread']
        sender = event['sender']
        candidateSignal = event['candidateSignal']
        
        await self.send(text_data=json.dumps({
            'type':type,
            'thread':thread,
            'sender':sender,
            'candidateSignal':candidateSignal
        }))


    #answer call with responding peer candidate signal
    async def accept_call_request(self, event):
        print('accept call request')
        type = event['type']
        thread = event['thread']
        sender = event['sender']
        candidateSignal = event['candidateSignal']
        
        await self.send(text_data=json.dumps({
            'type':type,
            'thread':thread,
            'sender':sender,
            'candidateSignal':candidateSignal
        }))
        
    async def decline_call_request(self, event):
        print('decline call request')
        type = event['type']
        thread = ['thread']
        sender = event['sender']
        
        await self.send(text_data = json.dumps({
            'type':type,
            'thread':thread,
            'sender':sender
        }))
        
    