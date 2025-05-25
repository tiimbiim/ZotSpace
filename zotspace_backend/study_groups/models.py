from django.db import models
from users.models import User
from django.utils import timezone

class StudyGroup(models.Model):
    GROUP_STATUS = [
        ('OPEN', 'Open'),
        ('INVITE_ONLY', 'Invite Only'),
        ('FULL', 'Full'),
    ]

    name = models.CharField(max_length=200)
    course_id = models.CharField(max_length=50, null=True, blank=True)  # Optional course association
    location = models.CharField(max_length=200)
    capacity = models.IntegerField()
    current_capacity = models.IntegerField(default=1)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    participants = models.ManyToManyField(User, related_name='joined_groups')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # New fields
    description = models.TextField(blank=True, null=True)  # Allow null for existing data
    start_time = models.DateTimeField(null=True, blank=True)  # Allow null for existing data
    end_time = models.DateTimeField(null=True, blank=True)  # Allow null for existing data
    status = models.CharField(max_length=20, choices=GROUP_STATUS, default='OPEN')
    tags = models.JSONField(default=list, blank=True)  # For storing course_id and other tags

    def __str__(self):
        return f"{self.name} - {self.course_id if self.course_id else 'No Course'}"

    def is_full(self):
        return self.current_capacity >= self.capacity

    def update_status(self):
        if self.is_full():
            self.status = 'FULL'
        elif self.status == 'FULL' and not self.is_full():
            self.status = 'OPEN'
        self.save() 