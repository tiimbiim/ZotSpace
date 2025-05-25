from django.urls import path
from . import views

urlpatterns = [
    path('available/', views.get_all_available_study_rooms, name='get_all_available_study_rooms'),
] 