from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Exam, Question, Result, Profile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_photo']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        profile_photo = profile_data.get('profile_photo') if profile_data else None
        print(profile_data)
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        if profile_photo:
            instance.profile.profile_photo = profile_photo
            instance.profile.save()

        return instance

class ExamSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Exam
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'user', 'exam', 'score', 'completed_at', 'attempts']  # You can exclude fields if needed
