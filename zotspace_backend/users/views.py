from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import User

@api_view(['GET'])
def get_courses(request, user_id):
    """
    Get all courses for a specific user
    """
    user = get_object_or_404(User, id=user_id)
    return Response({'courses': user.courses})

@api_view(['GET'])
def get_bookings(request, user_id):
    """
    Get all bookings for a specific user
    """
    user = get_object_or_404(User, id=user_id)
    return Response({'bookings': []})  # TODO: Implement booking retrieval

@api_view(['POST'])
def add_course(request, user_id):
    """
    Add a course to a user's course list
    
    Request Body:
    {
        "course_id": "string"  # Required: The ID of the course to add
    }
    
    Returns:
    - 200: Course added successfully
    - 400: Missing course_id
    - 404: User not found
    """
    user = get_object_or_404(User, id=user_id)
    course_id = request.data.get('course_id')
    
    if not course_id:
        return Response(
            {'error': 'course_id is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # TODO: Implement course addition logic
    # 1. Validate course_id exists
    # 2. Check if user already has the course
    # 3. Add course to user's course list
    # 4. Save user
    
    return Response({
        'message': 'Course added successfully',
        'course_id': course_id
    })

@api_view(['POST'])
def remove_course(request, user_id):
    """
    Remove a course from a user's course list
    
    Request Body:
    {
        "course_id": "string"  # Required: The ID of the course to remove
    }
    
    Returns:
    - 200: Course removed successfully
    - 400: Missing course_id
    - 404: User not found
    """
    user = get_object_or_404(User, id=user_id)
    course_id = request.data.get('course_id')
    
    if not course_id:
        return Response(
            {'error': 'course_id is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # TODO: Implement course removal logic
    # 1. Check if user has the course
    # 2. Remove course from user's course list
    # 3. Save user
    
    return Response({
        'message': 'Course removed successfully',
        'course_id': course_id
    }) 