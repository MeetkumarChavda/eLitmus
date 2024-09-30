from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import UserExamsView, result_detail, csrf_token_view, edit_profile, UserProfileView, signup_view, login_view, logout_view, ExamListCreateView, ExamDetailView, QuestionListCreateView, ResultListCreateView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('logout/', logout_view, name='logout'),
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('exams/<int:exam_id>/questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('users/<int:user_id>/results/', result_detail, name='result-list-create'),
    path('users/<int:user_id>/results/<int:pk>/', result_detail, name='result-detail'),  # Ensure this is correct
    path('users/<int:user_id>/', UserProfileView.as_view(), name='user-profile'),
    path('users/<int:user_id>/edit/', edit_profile, name='edit_profile'),
    path('users/<int:user_id>/exams/', UserExamsView.as_view(), name='user-exams'),
    path('csrf-token/', csrf_token_view, name='csrf-token'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
