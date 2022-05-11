from django.dispatch import Signal
import django.dispatch

deleteProfilePicSignal = Signal()   

#profile_picture_updated = django.dispatch.Signal(providing_args=['instance','profilePictureUpdated'])