from rest_framework import generics

class Routes(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        routes = {
            "users":{
                "users/token/":{
                    "methods":"POST",
                    "description":"send login credentials for authentication tokens",
                },
                "users/token/refresh/":{
                    "methods":"POST",
                    "description":"resend access token for new refresh token",
                },
                "users/detail/<str:username>/":{
                    "methods":"GET, PUT",
                    "description":"""GET: get profile and user details for one user,
                    PUT:update user profile and info"""
                },
                "users/list/":{
                    "methods":"GET",
                    "description":"list all users in database"
                },
                "users/create/":{
                    "methods":"POST",
                    "description":"create a new user"                  
                },
                "users/search/?q=query":{
                    "methods":"GET",
                    "description":"""takes query param and searches through users username and 
                    bios if they are active and verified instructors ordering by 
                    the most recently logged in"""
                },
            },
            "subscriptions":{
                "subscriptions/list/":{
                    "methods":"GET, POST",
                    "description":"GET: returns all subscriptions, POST: creates new subscription"
                },
                "subscriptions/detail/<int:pk>":{
                    "methods":"GET, DELETE",
                    "description":"GET:returns subscription detail, DELETE:deletes subscription"
                },
                "subscriptions/subscribers-list/":{
                    "methods":"GET",
                    "description":"returns all information for a users subscribers"                    
                },
                "subscriptions/subscriptions-list/":{
                    "methods":"GET",
                    "description":"returns all information for a users subscriptions"
                },
            },
            "follows":{
                "follows/followers/":{
                    "methods":"GET",
                    "description":"get users followers"
                },
                "follows/following/":{
                    "methods":"GET, POST",
                    "description":"GET: get all creators user is following, POST: create follow"
                },
                "follows/delete/":{
                    "methods":"delete",
                    "description":"delete follow"
                },
            },
            "content":{
                
            }
        }