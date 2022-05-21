import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.dispatch import receiver
from booking.models import classSessionId, appointment


@database_sync_to_async
def verify_user(requesting_user, class_session_id):
    try:
        Thread = appointment.objects.filter(packageSessionId = class_session_id, user=requesting_user).count()
        if Thread == 1:
            return True
        return False
    except:
        return False 

class groupClassConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chatcall_%s' % self.room_name

        print(self.user)
        #verify that user is a thread member
            # Join room group
        Verify = verify_user(self.user, self.room_name)
        if(Verify): 
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            print('joined awaiting accept')
            await self.accept()
            print('accepted')
            

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        print(text_data)
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        sender = text_data_json['sender']
        receiver = text_data_json['receiver']
        thread = text_data_json['thread']
        body = text_data_json['body']
        signal = text_data_json['candidateSignal']
        instructor_logged_on = text_data_json['instructor_logged_on']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': type,
                'sender':sender,
                'receiver':receiver,
                'thread':thread,
                'body':body,
                'instructor_logged_on':instructor_logged_on,
                'candidateSignal':signal
            }
        )


    #emit from instructor if instructor is logged on
    async def instructor_logged_on(self, event):
        print('instructor_has_joined')
        type = event['type']
        sender = event['sender']
        receiver = event['receiver']
        thread = event['thread']
        body = event['body']
        candidateSignal = event['candidateSignal']
        instructor_logged_on = event['instructor_logged_on']
        
        await self.send(text_data=json.dumps({
            'type':type,
            'thread':thread,
            'sender':sender,
            'receiver':receiver,
            'body':body,
            'instructor_logged_on':instructor_logged_on,
            'candidateSignal':candidateSignal
        }))
        
    #emits from viewer to see if instructor is logged on    
    async def is_instructor_logged_on(self, event):
        print('is_instructor_logged_on')
        type = event['type']
        thread = ['thread']
        sender = event['sender']
        receiver = event['receiver']
        body = event['body']
        candidateSignal = event['candidateSignal']
        instructor_logged_on = event['instructor_logged_on ']
        
        await self.send(text_data = json.dumps({
            'type':type,
            'thread':thread,
            'sender':sender, 
            'receiver':receiver,
            'body':body,
            'instructor_logged_on':instructor_logged_on,
            'candidateSignal':candidateSignal
        }))   
        

    #send call request with peer candidate signal from viewer to instructor
    async def call_request(self, event):
        print('call request')
        type = event['type']
        thread = event['thread']
        sender = event['sender']
        receiver = event['receiver']
        candidateSignal = event['candidateSignal']
        instructor_logged_on = event['instructor_logged_on'],
        body = event['body']
        
        await self.send(text_data=json.dumps({
            'type':type,
            'thread':thread,
            'sender':sender,
            'receiver':receiver,
            'candidateSignal':candidateSignal,
            'instructor_logged_on':instructor_logged_on,
            'body':body
        }))


    #answer viewer call with responding peer candidate signal from instructor
    async def accept_call_request(self, event):
        print('accept call request')
        type = event['type']
        thread = event['thread']
        sender = event['sender']
        receiver = event['receiver']
        candidateSignal = event['candidateSignal']
        instructor_logged_on = event['instructor_logged_on'],
        body = event['body']
        
        await self.send(text_data=json.dumps({
            'type':type,
            'thread':thread,
            'sender':sender,
            'receiver':receiver,
            'candidateSignal':candidateSignal,
            'instructor_logged_on':instructor_logged_on,
            'body':body
        }))
        
        

        
    