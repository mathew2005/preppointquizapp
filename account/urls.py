from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register, name='register'),
    path('profile/<str:username>', views.profile, name='profile'),
    path('settings', views.editProfile, name='edit_profile'),
    path('delete', views.deleteProfile, name='delete_profile'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('verify/<str:uidb64>/<str:token>/', views.verify_email, name='verify_email'),


]