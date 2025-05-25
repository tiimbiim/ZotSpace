from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Todo
from .serializers import TodoSerializer

@api_view(['POST'])
def create_todo(request):
    """
    Create a new todo item for the authenticated user
    """
    try:
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            # Set the user directly from request.user
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Failed to create todo: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_user_todos(request):
    """
    Get all todo items for the authenticated user
    """
    try:
        todos = Todo.objects.filter(user=request.user)
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch todos: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_todo(request, todo_id):
    """
    Get a specific todo item for the authenticated user
    """
    try:
        todo = Todo.objects.get(id=todo_id, user=request.user)
        serializer = TodoSerializer(todo)
        return Response(serializer.data)
    except Todo.DoesNotExist:
        return Response(
            {'error': 'Todo not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['PUT'])
def update_todo(request, todo_id):
    """
    Update a specific todo item for the authenticated user
    """
    try:
        todo = Todo.objects.get(id=todo_id, user=request.user)
        serializer = TodoSerializer(todo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Todo.DoesNotExist:
        return Response(
            {'error': 'Todo not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['DELETE'])
def delete_todo(request, todo_id):
    """
    Delete a specific todo item for the authenticated user
    """
    try:
        todo = Todo.objects.get(id=todo_id, user=request.user)
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Todo.DoesNotExist:
        return Response(
            {'error': 'Todo not found'},
            status=status.HTTP_404_NOT_FOUND
        ) 