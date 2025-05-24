from django.db import models
from users.models import User

class StudyGroup(models.Model):
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

    def __str__(self):
        return f"{self.name} - {self.course_id if self.course_id else 'No Course'}" 