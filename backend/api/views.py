import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Exam, Question, Result, Profile
from .serializers import ExamSerializer, QuestionSerializer, ResultSerializer, UserSerializer
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import base64
import os
from django.core.files.base import ContentFile
from django.utils import timezone

def csrf_token_view(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

class UserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile  # Use the user instance to get the profile

            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,  # Add other fields as needed
                'profile_image': "http://localhost:8000" + profile.profile_photo.url if profile.profile_photo else None  # Handle if profile_photo is None
            }
            return JsonResponse(user_data, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Profile.DoesNotExist:
            return JsonResponse({'error': 'Profile not found'}, status=404)
    
    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200) 
            return JsonResponse(serializer.errors, status=400) 
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404) 

class ExamListCreateView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        print(self.request.user)  # Log the user making the request
        serializer.save()

class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [AllowAny]

class UserExamsView(generics.ListAPIView):
    serializer_class = ExamSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Exam.objects.filter(created_by=user_id)

class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        exam_id = self.kwargs['exam_id']
        return Question.objects.filter(exam_id=exam_id)

    def perform_create(self, serializer):
        exam_id = self.kwargs['exam_id']
        exam = Exam.objects.get(id=exam_id)
        serializer.save(exam=exam)




class ResultListCreateView(generics.ListCreateAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Result.objects.filter(user__id=user_id) 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@csrf_exempt
def result_detail(request, user_id, pk=None):
    try:
        if pk:
            result = Result.objects.get(id=pk, user__id=user_id)
        else:
            results = Result.objects.filter(user__id=user_id)
    except Result.DoesNotExist:
        return JsonResponse({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if pk:
            serializer = ResultSerializer(result)
        else:
            serializer = ResultSerializer(results, many=True)  # Handle multiple results
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST' and pk is None:  # pk should not be provided for POST
        try:
            data = json.loads(request.body)  # Load the JSON data
            data['user'] = user_id  # Assign the user_id to the result
            serializer = ResultSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT' and pk:
        try:
            data = json.loads(request.body)
            result = Result.objects.get(id=pk, user__id=user_id)

            serializer = ResultSerializer(result, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE' and pk:
        result.delete()
        return JsonResponse({'detail': 'Result deleted.'}, status=status.HTTP_204_NO_CONTENT)

    return JsonResponse({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# Login view
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Load JSON data
            username = data.get('username')
            password = data.get('password')
        except (json.JSONDecodeError, KeyError):
            return JsonResponse({'error': 'Invalid data'}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # print(user.id)
            return JsonResponse({'message': 'Login successful','id':user.id}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

    return JsonResponse({'error': 'POST request required'}, status=400)

# Signup view
@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Load JSON data
            username = data.get('username')
            password = data.get('password')
            password2 = data.get('password2')
        except (json.JSONDecodeError, KeyError):
            return JsonResponse({'error': 'Invalid request'}, status=400)

        if password != password2:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(username=username, password=password)
        user.save()

        # Create a Profile for the user
        profile = Profile.objects.create(user=user)
        profile.save()

        return JsonResponse({'message': 'User created successfully', 'id': user.id}, status=201)

    return JsonResponse({'error': 'POST request required'}, status=400)

# Logout view
@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'}, status=200)

@csrf_exempt
def edit_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    if request.method == 'PUT':
        try:
            data = json.loads(request.body)  # Load JSON data
            email = data.get('email', None)
            password = data.get('password', None)
            profile_photo = data.get('profile_photo', None)            

            if email:
                user.email = email
            
            if password:
                user.set_password(password)  # Use set_password to hash the password

            if profile_photo:
                format, imgstr = profile_photo.split(';base64,') # Extract the image format and base64 string
                ext = format.split('/')[-1] # Get the file extension
                profile_image_file = ContentFile(base64.b64decode(imgstr), name=f"profile_image.{ext}")
                user.profile.profile_photo.save(f"profile_image.{ext}", profile_image_file, save=True)

            user.save()
            return JsonResponse({"id": user.id,"username": user.username, "email":user.email, 'profile_image': "http://localhost:8000/"+user.profile.profile_photo.url}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'Invalid data'}, status=400)

    return JsonResponse({'error': 'PUT request required'}, status=400)