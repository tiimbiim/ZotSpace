from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import StudyRoom, StudyRoomSlot
from .serializers import StudyRoomSerializer, CreateStudyRoomSerializer
import requests
from datetime import datetime

class StudyRoomViewSet(viewsets.ModelViewSet):
    serializer_class = StudyRoomSerializer
    queryset = StudyRoom.objects.all()

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

@api_view(['GET'])
def get_all_available_study_rooms(request):
    """
    Get all available study rooms from the external API with optional filters
    Query Parameters:
    - date: YYYY-MM-DD format (default: today)
    - start_time: HH:MM format
    - end_time: HH:MM format
    - min_capacity: minimum capacity required
    - max_capacity: maximum capacity required
    - location: location name to filter by (e.g., "Science Library", "Multimedia Resources Center")
    """
    # Get query parameters
    date = request.query_params.get('date', datetime.now().strftime('%Y-%m-%d'))
    start_time = request.query_params.get('start_time')
    end_time = request.query_params.get('end_time')
    min_capacity = request.query_params.get('min_capacity')
    max_capacity = request.query_params.get('max_capacity')
    location = request.query_params.get('location')

    # Make request to external API
    api_url = 'https://anteaterapi.com/v2/rest/studyRooms'
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        rooms = response.json().get('data', [])

        # First, filter out rooms with no available slots
        rooms = [
            room for room in rooms
            if any(slot.get('isAvailable', False) for slot in room.get('slots', []))
        ]

        # Apply filters
        filtered_rooms = rooms

        # Filter by capacity
        if min_capacity:
            filtered_rooms = [
                room for room in filtered_rooms
                if room.get('capacity', 0) >= int(min_capacity)
            ]

        if max_capacity:
            filtered_rooms = [
                room for room in filtered_rooms
                if room.get('capacity', 0) <= int(max_capacity)
            ]

        # Filter by location
        if location:
            location = location.lower()
            filtered_rooms = [
                room for room in filtered_rooms
                if (
                    # Check exact location match
                    location == room.get('location', '').lower() or
                    # Special case for Science Library
                    (location == 'science library' and 
                     'science library' in room.get('description', '').lower())
                )
            ]

        # Filter by available slots in time range
        if start_time and end_time:
            # Convert time strings to datetime objects for comparison
            start_dt = datetime.strptime(f"{date} {start_time}", "%Y-%m-%d %H:%M")
            end_dt = datetime.strptime(f"{date} {end_time}", "%Y-%m-%d %H:%M")
            
            filtered_rooms = []
            for room in rooms:
                available_slots = [
                    slot for slot in room.get('slots', [])
                    if slot.get('isAvailable', False)
                ]
                
                # Check if any available slot overlaps with requested time range
                has_available_slot = False
                for slot in available_slots:
                    slot_start = datetime.fromisoformat(slot['start'].replace('Z', '+00:00'))
                    slot_end = datetime.fromisoformat(slot['end'].replace('Z', '+00:00'))
                    
                    # Check if slot overlaps with requested time range
                    if (slot_start <= end_dt and slot_end >= start_dt):
                        has_available_slot = True
                        break
                
                if has_available_slot:
                    filtered_rooms.append(room)

        return Response(filtered_rooms)

    except requests.RequestException as e:
        return Response(
            {'error': f'Failed to fetch study rooms: {str(e)}'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        ) 