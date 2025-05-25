from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'net_id', 'courses', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] 