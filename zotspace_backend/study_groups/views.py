from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import StudyGroup
from .serializers import StudyGroupSerializer

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