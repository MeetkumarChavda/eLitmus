from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_photo = models.ImageField(upload_to='profile_photos/', default='default.jpg')

    def __str__(self):
        return self.user.username

class Exam(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exams', null=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    exam = models.ForeignKey(Exam, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    option1 = models.CharField(max_length=255,null=True)
    option2 = models.CharField(max_length=255,null=True)
    option3 = models.CharField(max_length=255,null=True)
    option4 = models.CharField(max_length=255,null=True)
    
    answer = models.IntegerField(choices=[(1, 'Option 1'), (2, 'Option 2'), (3, 'Option 3'), (4, 'Option 4')])

    def __str__(self):
        return self.text
    
class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    score = models.FloatField()
    completed_at = models.DateTimeField(default=timezone.now)
    attempts = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.exam.title}: {self.score}"