from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_todo, name='create_todo'),
    path('list/', views.get_user_todos, name='get_user_todos'),
    path('<int:todo_id>/', views.get_todo, name='get_todo'),
    path('<int:todo_id>/update/', views.update_todo, name='update_todo'),
    path('<int:todo_id>/delete/', views.delete_todo, name='delete_todo'),
] 