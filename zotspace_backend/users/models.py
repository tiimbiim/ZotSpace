from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError

def validate_uci_email(value):
    if not value.endswith('@uci.edu'):
        raise ValidationError('Email must be a valid UCI email address (@uci.edu)')

class User(AbstractUser):
    net_id = models.CharField(max_length=50, unique=True)
    courses = models.JSONField(default=list)  # List of current quarter courses
    email = models.EmailField(unique=True, validators=[validate_uci_email])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.net_id

    def get_email_domain(self):
        return self.email.split('@')[1]

    def save(self, *args, **kwargs):
        if not self.net_id:
            self.net_id = self.email.split('@')[0]
        super().save(*args, **kwargs) 