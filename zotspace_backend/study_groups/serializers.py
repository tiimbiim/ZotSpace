from rest_framework import serializers
from .models import StudyGroup
from users.serializers import UserSerializer

class StudyGroupSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    current_capacity = serializers.SerializerMethodField()

    class Meta:
        model = StudyGroup
        fields = [
            'id', 'name', 'course_id', 'location', 'capacity',
            'current_capacity', 'created_by', 'participants', 'is_active'
        ]

    def get_current_capacity(self, obj):
        return obj.participants.count() 