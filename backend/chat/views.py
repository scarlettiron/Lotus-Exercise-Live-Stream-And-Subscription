from rest_framework import generics, response
from django.db.models import Q
from .models import thread, message
from.serializers import message_serializer, user_threads_serializer, create_thread_serializer
from .mixins import MessagesMixin

class list_create_thread(MessagesMixin, generics.ListCreateAPIView):
    queryset = thread.objects.filter()
    lookup_fields = ['user1', 'user2']
    serializer_class = user_threads_serializer
    
 
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return user_threads_serializer
        if self.request.method == 'POST':
            return create_thread_serializer
 
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        try:
            qs = thread.objects.filter(Q(user1=user) | Q(user2=user)).select_related('user1', 'user2')
        except:
            qs = thread.objects.none()
        return qs
           
    def create(self, request, *args, **kwargs):
        data = self.request.data
        
        t = thread.objects.filter(user1__id = data['user1'], user2__id = data['user2']).select_related('user1', 'user2')
        if t.count() > 0:
            serializer = user_threads_serializer(t[0]).data
            return response.Response(serializer, status = 200)
        return super().create(request, *args, **kwargs)   


### get all messages belonging to a thread
class get_messages(MessagesMixin, generics.ListCreateAPIView):
    model = message
    queryset = message.objects.filter()
    lookup_field = 'thread'
    serializer_class = message_serializer
    
    def get_queryset(self):
        thread = self.kwargs['thread']
        try:
            qs = message.objects.filter(thread = thread)
        except:
            qs = message.objects.none()
        return qs
    
    
    
    def get(self, request, *args, **kwargs):
        thread_id = self.kwargs['thread']
        Thread = thread.objects.filter(pk=thread_id).select_related('user1', 'user2')
        self.check_object_permissions(request, Thread[0])
        
        modified_response = super().list(request, *args, **kwargs)
        thread_id = self.kwargs['thread']
        
        Thread.update(has_unread=False)
        serializer = user_threads_serializer(Thread[0]).data
        
        modified_response.data['thread'] = serializer
        return modified_response






### optimized version ###
# returns current thread and all messages belonging to said current thread
# as well as all other user threads      
class thread_detail(generics.ListCreateAPIView):
    model = thread
    queryset = message.objects.filter()
    lookup_field= 'thread'
    serializer_class = message_serializer
    
    
    def get_queryest(self, request, *args, **kwargs):
        Thread = self.kwargs['thread']
        try:
            qs = message.objects.filter(thread=Thread)
        except:
            qs = message.objects.none()
        return qs
            
    def get(self, request, *args, **kawrgs):
        modified_response = super().list(request, *args, **kawrgs)
        thread_id = self.kwargs['thread']
        
        Thread = thread.objects.filter(pk=thread_id).select_related('user1', 'user2')
        thread_data = user_threads_serializer(Thread[0]).data
        modified_response.data['current_thread'] = thread_data
        
        all_threads = thread.objects.filter(Q(user1 = request.user) | Q(user2 = request.user))
        all_threads_data = user_threads_serializer(all_threads, many=True).data
        modified_response.data['all_threads'] = {'results':[], 'count':0}
        modified_response.data['all_threads']['results'] = all_threads_data
        modified_response.data['all_threads']['count'] = all_threads.count()
        return modified_response
