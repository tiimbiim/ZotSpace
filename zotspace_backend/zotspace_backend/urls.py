"""
URL configuration for zotspace_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from users import views as user_views
from study_groups import views as study_group_views
from study_rooms import views as study_room_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # User endpoints
    path('api/users/check-email/', user_views.check_email_exists),
    path('api/users/create/', user_views.create_user),
    path('api/users/<int:user_id>/courses/', user_views.get_courses),
    path('api/users/<int:user_id>/bookings/', user_views.get_bookings),
    path('api/users/<int:user_id>/courses/add/', user_views.add_course),
    path('api/users/<int:user_id>/courses/remove/', user_views.remove_course),
    
    # Study Group endpoints
    path('api/study-groups/create/', study_group_views.create_study_group),
    path('api/study-groups/<int:group_id>/', study_group_views.get_study_group),
    path('api/study-groups/<int:group_id>/delete/', study_group_views.delete_study_group),
    path('api/study-groups/', study_group_views.get_all_study_groups),
    path('api/study-groups/available/', study_group_views.get_all_available_study_groups),
    
    # Study Room endpoints
    path('api/study-rooms/', include('study_rooms.urls')),  # Include study_rooms URLs
]
