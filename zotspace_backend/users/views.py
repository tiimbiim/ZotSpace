from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password
import re
import requests

def validate_course_format(course):
    """
    Validate that the course follows UCI format:
    - Department code (2-4 letters) followed by course number (1-3 digits)
    - Optional space between department and number
    - Examples: CS141, ICS 33, MATH 2B
    """
    pattern = r'^[A-Z]{2,4}\s*\d{1,3}[A-Z]?$'
    return bool(re.match(pattern, course))

def validate_course_exists(course_id):
    """
    Validate that the course exists in the Anteater API
    """
    try:
        response = requests.get(f'https://anteaterapi.com/v2/rest/courses/batch?ids={course_id}')
        if response.status_code == 200:
            data = response.json()
            return data.get('ok', False) and len(data.get('data', [])) > 0
        return False
    except Exception:
        return False

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
    Course must be a valid course ID from the Anteater API (e.g., COMPSCI161)
    """
    try:
        user = User.objects.get(id=user_id)
        course_id = request.data.get('course_id')
        
        if not course_id:
            return Response(
                {'error': 'Course ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate course exists in Anteater API
        if not validate_course_exists(course_id):
            return Response(
                {'error': 'Invalid course ID. Course not found in Anteater API'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if course_id not in user.courses:
            user.courses.append(course_id)
            user.save()
            return Response({
                'message': 'Course added successfully',
                'course_id': course_id,
                'updated_courses': user.courses
            })
        else:
            return Response({
                'message': 'Course already exists in user\'s list',
                'course_id': course_id,
                'courses': user.courses
            })
            
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to add course: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
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

@api_view(['POST'])
def create_user(request):
    """
    Create a new user with their UCI email
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'User with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the user
        user = User.objects.create_user(
            email=email,
            password=password
        )

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': f'Failed to create user: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def check_email_exists(request):
    """
    Check if an email exists in the database
    """
    email = request.query_params.get('email')
    
    if not email:
        return Response(
            {'error': 'Email parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    exists = User.objects.filter(email=email).exists()
    return Response({
        'email': email,
        'exists': exists
    })

@api_view(['GET'])
def get_user_id_by_email(request):
    """
    Get a user's ID by their email address
    """
    email = request.query_params.get('email')
    
    if not email:
        return Response(
            {'error': 'Email parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        return Response({
            'user_id': user.id,
            'email': user.email
        })
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        ) 