from rest_framework import serializers
from .models import StudyRoom, StudyRoomSlot
from users.serializers import UserSerializer

class StudyRoomSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyRoomSlot
        fields = ['id', 'date', 'start_time', 'end_time', 'is_available']

class StudyRoomSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    slots = StudyRoomSlotSerializer(many=True, read_only=True)
    current_capacity = serializers.SerializerMethodField()

    class Meta:
        model = StudyRoom
        fields = [
            'id', 'name', 'location', 'capacity', 'current_capacity',
            'created_by', 'participants', 'slots'
        ]

    def get_current_capacity(self, obj):
        return obj.participants.count()

class CreateStudyRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyRoom
        fields = ['name', 'location', 'capacity'] 