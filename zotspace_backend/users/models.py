from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError

def validate_uci_email(value):
    if not value.endswith('@uci.edu'):
        raise ValidationError('Email must be a valid UCI email address (@uci.edu)')

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True, null=True)  # Make username optional
    email = models.EmailField(unique=True, validators=[validate_uci_email])
    net_id = models.CharField(max_length=50, unique=True)
    courses = models.JSONField(default=list)  # List of current quarter courses
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'  # Use email as the username field
    REQUIRED_FIELDS = ['net_id']  # Email is required by default

    def __str__(self):
        return self.email

    def get_email_domain(self):
        return self.email.split('@')[1]

    def save(self, *args, **kwargs):
        if not self.net_id:
            self.net_id = self.email.split('@')[0]
        if not self.username:
            self.username = self.email  # Use email as username
        super().save(*args, **kwargs) 