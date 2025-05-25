from django.db import models
from users.models import User

class Todo(models.Model):
    TODO_TYPE_CHOICES = [
        ('ASSIGNMENT', 'Assignment'),
        ('EXAM', 'Exam'),
        ('OTHER', 'Other'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    todo_type = models.CharField(max_length=20, choices=TODO_TYPE_CHOICES)
    due_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.user.email}"

    class Meta:
        ordering = ['due_date', 'created_at'] 