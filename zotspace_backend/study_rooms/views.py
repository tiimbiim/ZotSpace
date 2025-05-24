from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import StudyRoom, StudyRoomSlot
from .serializers import StudyRoomSerializer, CreateStudyRoomSerializer
import requests
from datetime import datetime

class StudyRoomViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StudyRoomSerializer

    def get_queryset(self):
        queryset = StudyRoom.objects.all()
        
        # Filter by course if provided
        course = self.request.query_params.get('course', None)
        if course:
            queryset = queryset.filter(
                Q(created_by__courses__contains=[course]) |
                Q(participants__courses__contains=[course])
            ).distinct()
        
        # Filter by available slots
        available_only = self.request.query_params.get('available_only', None)
        if available_only:
            queryset = queryset.filter(slots__is_available=True).distinct()
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateStudyRoomSerializer
        return StudyRoomSerializer

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        study_room = self.get_object()
        
        # Check if room is full
        if study_room.participants.count() >= study_room.capacity:
            return Response(
                {'error': 'Study room is at full capacity'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add user to participants
        study_room.participants.add(request.user)
        return Response({'status': 'joined study room'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        study_room = self.get_object()
        study_room.participants.remove(request.user)
        return Response({'status': 'left study room'})

    @action(detail=True, methods=['post'])
    def book_slot(self, request, pk=None):
        study_room = self.get_object()
        slot_id = request.data.get('slot_id')
        
        try:
            slot = study_room.slots.get(id=slot_id)
            if not slot.is_available:
                return Response(
                    {'error': 'Slot is not available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            slot.is_available = False
            slot.save()
            return Response({'status': 'slot booked'})
            
        except StudyRoomSlot.DoesNotExist:
            return Response(
                {'error': 'Slot not found'},
                status=status.HTTP_404_NOT_FOUND
            )

@api_view(['GET'])
def get_all_available_study_rooms(request):
    """
    Get all available study rooms from the external API with optional filters
    Query Parameters:
    - date: YYYY-MM-DD format (default: today)
    - start_time: HH:MM format
    - end_time: HH:MM format
    - capacity: minimum capacity required
    - location: location name to filter by
    """
    # Get query parameters
    date = request.query_params.get('date', datetime.now().strftime('%Y-%m-%d'))
    start_time = request.query_params.get('start_time')
    end_time = request.query_params.get('end_time')
    capacity = request.query_params.get('capacity')
    location = request.query_params.get('location')

    # Make request to external API
    api_url = 'https://anteaterapi.com/v2/rest/studyRooms'
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        rooms = response.json().get('data', [])

        # Apply filters
        filtered_rooms = rooms
        if start_time and end_time:
            filtered_rooms = [
                room for room in filtered_rooms
                if any(
                    slot['start'] >= start_time and slot['end'] <= end_time
                    for slot in room.get('slots', [])
                )
            ]
        
        if capacity:
            filtered_rooms = [
                room for room in filtered_rooms
                if room.get('capacity', 0) >= int(capacity)
            ]

        if location:
            filtered_rooms = [
                room for room in filtered_rooms
                if location.lower() in room.get('location', '').lower()
            ]

        return Response(filtered_rooms)

    except requests.RequestException as e:
        return Response(
            {'error': f'Failed to fetch study rooms: {str(e)}'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        ) 