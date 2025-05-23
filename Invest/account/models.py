"""
    Модели для приложения Account
"""

import os
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from invest_projects.models import Item
from datetime import datetime
from datetime import timedelta
import pytz


def validate_video_extension(self, value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.mp4', '.mov', '.avi', '.mkv']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Недопустимый формат видео. Допустимые форматы: mp4, mov, avi, mkv')

class SupportMail(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Profile(models.Model):
    """
        Профиль для пользователя
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username  = models.CharField(max_length=300)
    profile_status = models.CharField(max_length=200, null=True, blank=True)
    interest = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='profile_avatars', blank=True, null=True, max_length=500)
    images = models.ManyToManyField('ProfileImage', related_name='images_for_profile', null=True, blank=True)
    phone_number = models.CharField(max_length=20)
    phone_verified = models.BooleanField(default=False)
    favorites = models.ManyToManyField(Item, blank=True)
    snils = models.ImageField(upload_to='profile_snils', blank=True, null=True)
    passport = models.ImageField(upload_to='profile_passport', blank=True, null=True)
    ogrn = models.ImageField(upload_to='profile_ogrn', blank=True, null=True)
    inn = models.ImageField(upload_to='profile_inn', blank=True, null=True)
    last_acivity = models.DateTimeField(default=timezone.now)
    company = models.CharField(max_length=200, default='Нет')
    branch = models.CharField(max_length=200, default='Нет')
    position_on_company = models.CharField(max_length=200, default='Нет')
    site_company = models.CharField(max_length=200, default='Нет')
    about_user = models.TextField(default='Нет')
    about_user_sub_info = models.TextField(default='Нет')


    def user_is_online(self):
        past_time_with_timezone = (
            datetime.now()-timedelta(minutes=5)).replace(tzinfo=pytz.UTC)
        print('PAST: ', str(past_time_with_timezone))
        print('last: ', str(self.last_acivity))
        if self.last_acivity <= past_time_with_timezone:
            return False
        return True

    def __str__(self):
        return self.user.email

class ProfileImage(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_imgs', blank=True, null=True)

class ProfileVideo(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    video = models.FileField(
        upload_to='profile_videos',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi', 'mkv'])]
        )
    
    def __str__(self):
        return f'Видео с id {self.id} профиля {self.profile.id}'
