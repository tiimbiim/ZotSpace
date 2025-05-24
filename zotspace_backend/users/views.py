from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

@api_view(['GET'])
def get_courses(request, user_id):
    """
    Get all courses for a specific user
    """
    try:
        user = User.objects.get(id=user_id)
        return Response({'courses': user.courses})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def get_bookings(request, user_id):
    """
    Get all bookings for a specific user
    """
    try:
        user = User.objects.get(id=user_id)
        return Response({'bookings': []})  # Placeholder for now
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
def add_course(request, user_id):
    """
    Add a course to a user's course list
    """
    try:
        user = User.objects.get(id=user_id)
        course = request.data.get('course')
        if not course:
            return Response(
                {'error': 'Course is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if course not in user.courses:
            user.courses.append(course)
            user.save()
        
        return Response({'message': 'Course added successfully'})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
def remove_course(request, user_id):
    """
    Remove a course from a user's course list
    """
    try:
        user = User.objects.get(id=user_id)
        course = request.data.get('course')
        if not course:
            return Response(
                {'error': 'Course is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if course in user.courses:
            user.courses.remove(course)
            user.save()
        
        return Response({'message': 'Course removed successfully'})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        ) 