from django.db import models
from users.models import User

class StudyRoom(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    capacity = models.IntegerField()
    description = models.TextField(blank=True, null=True)  # Allow null for existing data
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.location}"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    study_room = models.ForeignKey(StudyRoom, on_delete=models.CASCADE, related_name='bookings')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.user.email} - {self.study_room.name} ({self.start_time} to {self.end_time})"

    def is_overlapping(self):
        """Check if this booking overlaps with any existing bookings for the same room"""
        return Booking.objects.filter(
            study_room=self.study_room,
            is_active=True,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(id=self.id).exists()

class StudyRoomSlot(models.Model):
    study_room = models.ForeignKey(StudyRoom, on_delete=models.CASCADE, related_name='slots')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.study_room.name} - {self.start_time} to {self.end_time}"

    class Meta:
        ordering = ['start_time'] 