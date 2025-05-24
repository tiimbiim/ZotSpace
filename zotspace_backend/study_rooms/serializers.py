from rest_framework import serializers
from .models import StudyRoom, StudyRoomSlot
from users.serializers import UserSerializer

class StudyRoomSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyRoomSlot
        fields = ['id', 'start_time', 'end_time', 'is_available']

class StudyRoomSerializer(serializers.ModelSerializer):
    slots = StudyRoomSlotSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    available_slots = serializers.SerializerMethodField()

    class Meta:
        model = StudyRoom
        fields = [
            'id', 'name', 'capacity', 'location', 'description',
            'directions', 'tech_enhanced', 'created_by', 'participants',
            'slots', 'available_slots'
        ]

    def get_available_slots(self, obj):
        return obj.slots.filter(is_available=True).count()

class CreateStudyRoomSerializer(serializers.ModelSerializer):
    slots = StudyRoomSlotSerializer(many=True)

    class Meta:
        model = StudyRoom
        fields = [
            'name', 'capacity', 'location', 'description',
            'directions', 'tech_enhanced', 'slots'
        ]

    def create(self, validated_data):
        slots_data = validated_data.pop('slots')
        study_room = StudyRoom.objects.create(
            created_by=self.context['request'].user,
            **validated_data
        )
        
        for slot_data in slots_data:
            StudyRoomSlot.objects.create(study_room=study_room, **slot_data)
        
        return study_room 