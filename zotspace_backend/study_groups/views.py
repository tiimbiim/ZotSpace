from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import StudyGroup
from .serializers import StudyGroupSerializer
from datetime import datetime

def check_time_conflicts(user, start_time, end_time, location):
    """
    Check if a user has any conflicting study groups in the given time range and location
    """
    # Get all study groups the user is part of (either as creator or participant)
    user_groups = StudyGroup.objects.filter(
        Q(created_by=user) | Q(participants=user),
        is_active=True
    )

    # Check for time and location conflicts
    for group in user_groups:
        # Check if time ranges overlap
        if (group.start_time <= end_time and group.end_time >= start_time):
            # Check if location is the same
            if group.location.lower() == location.lower():
                return True, group
    return False, None

@api_view(['GET'])
def get_study_group(request, group_id):
    """
    Get detailed information about a specific study group
    """
    try:
        study_group = StudyGroup.objects.get(id=group_id)
        serializer = StudyGroupSerializer(study_group)
        return Response(serializer.data)
    except StudyGroup.DoesNotExist:
        return Response(
            {'error': 'Study group not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def get_all_study_groups(request):
    """
    Get a list of all study groups
    """
    study_groups = StudyGroup.objects.all()
    serializer = StudyGroupSerializer(study_groups, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_available_study_groups(request):
    """
    Get a list of all available (active) study groups
    """
    study_groups = StudyGroup.objects.filter(is_active=True)
    serializer = StudyGroupSerializer(study_groups, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_study_group(request, group_id):
    """
    Delete a study group and update all related user records
    """
    try:
        study_group = StudyGroup.objects.get(id=group_id)
        
        # Get all participants before deletion
        participants = list(study_group.participants.all())
        creator = study_group.created_by
        
        # Remove the study group from all participants' joined_groups
        for participant in participants:
            participant.joined_groups.remove(study_group)
        
        # Remove the study group from creator's created_groups
        creator.created_groups.remove(study_group)
        
        # Delete the study group
        study_group.delete()
        
        return Response({
            'message': 'Study group deleted successfully',
            'details': {
                'group_id': group_id,
                'group_name': study_group.name,
                'affected_users': len(participants) + 1  # +1 for the creator
            }
        })
        
    except StudyGroup.DoesNotExist:
        return Response(
            {'error': 'Study group not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to delete study group: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def create_study_group(request):
    """
    Create a new study group with the following requirements:
    - No time conflicts with user's existing study groups
    - No location conflicts in the same time frame
    - Validates group status (OPEN, INVITE_ONLY, FULL)
    - Handles course_id and tags
    """
    try:
        # Extract data from request
        name = request.data.get('name')
        course_id = request.data.get('course_id')
        location = request.data.get('location')
        capacity = request.data.get('capacity')
        description = request.data.get('description')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        status = request.data.get('status', 'OPEN')
        tags = request.data.get('tags', [])

        # Validate required fields
        if not all([name, location, capacity, description, start_time, end_time]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convert time strings to datetime objects
        try:
            start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            end_time = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
        except ValueError:
            return Response(
                {'error': 'Invalid time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate time range
        if start_time >= end_time:
            return Response(
                {'error': 'End time must be after start time'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if start_time < timezone.now():
            return Response(
                {'error': 'Cannot create study group in the past'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for time and location conflicts
        has_conflict, conflicting_group = check_time_conflicts(
            request.user, start_time, end_time, location
        )
        if has_conflict:
            return Response(
                {
                    'error': 'Time and location conflict with existing study group',
                    'conflicting_group': {
                        'id': conflicting_group.id,
                        'name': conflicting_group.name,
                        'start_time': conflicting_group.start_time,
                        'end_time': conflicting_group.end_time
                    }
                },
                status=status.HTTP_409_CONFLICT
            )

        # Create the study group
        study_group = StudyGroup.objects.create(
            name=name,
            course_id=course_id,
            location=location,
            capacity=capacity,
            description=description,
            start_time=start_time,
            end_time=end_time,
            status=status,
            tags=tags,
            created_by=request.user
        )

        # Add creator as first participant
        study_group.participants.add(request.user)
        study_group.current_capacity = 1
        study_group.save()

        # Update status if needed
        study_group.update_status()

        serializer = StudyGroupSerializer(study_group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': f'Failed to create study group: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 