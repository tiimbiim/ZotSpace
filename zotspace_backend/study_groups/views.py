from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import StudyGroup

@api_view(['GET'])
def get_study_group(request, group_id):
    """
    Get detailed information about a specific study group
    """
    group = get_object_or_404(StudyGroup, id=group_id)
    return Response({
        'id': group.id,
        'name': group.name,
        'course_id': group.course_id,
        'location': group.location,
        'capacity': group.capacity,
        'current_capacity': group.current_capacity,
        'created_by': group.created_by.email,
        'participants': [user.email for user in group.participants.all()],
        'is_active': group.is_active
    })

@api_view(['GET'])
def get_all_study_groups(request):
    """
    Get all study groups
    """
    groups = StudyGroup.objects.all()
    return Response([{
        'id': group.id,
        'name': group.name,
        'course_id': group.course_id,
        'location': group.location,
        'capacity': group.capacity,
        'current_capacity': group.current_capacity,
        'created_by': group.created_by.email,
        'participants_count': group.participants.count(),
        'is_active': group.is_active
    } for group in groups])

@api_view(['GET'])
def get_all_available_study_groups(request):
    """
    Get all available (active) study groups
    """
    groups = StudyGroup.objects.filter(is_active=True)
    return Response([{
        'id': group.id,
        'name': group.name,
        'course_id': group.course_id,
        'location': group.location,
        'capacity': group.capacity,
        'current_capacity': group.current_capacity,
        'created_by': group.created_by.email,
        'participants_count': group.participants.count()
    } for group in groups]) 