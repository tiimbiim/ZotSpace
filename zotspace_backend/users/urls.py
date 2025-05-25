from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_user, name='create_user'),
    path('check-email/', views.check_email_exists, name='check_email_exists'),
    path('get-id/', views.get_user_id_by_email, name='get_user_id_by_email'),
    path('<int:user_id>/courses/', views.get_courses, name='get_courses'),
    path('<int:user_id>/courses/add/', views.add_course, name='add_course'),
    path('<int:user_id>/courses/remove/', views.remove_course, name='remove_course'),
    path('<int:user_id>/bookings/', views.get_bookings, name='get_bookings'),
] 