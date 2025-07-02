from django.urls import path
from . import views

urlpatterns = [

    path('', views.home_view, name='home'),
    path('leaderboard', views.leaderboard_view, name='leaderboard'),
    path('dashboard', views.dashboard_view, name='dashboard'),
    path('message/<int:id>', views.message_view, name='message'),
    path('about', views.about_view, name='about'),
    path('blogs', views.blogs_view, name='blogs'),
    path('blogs/<str:blog_id>', views.blog_view, name='blog'),
    path('contact', views.contact_view, name='contact'),
    path('downloads', views.downloads_view, name='downloads'),
    path('search/users', views.search_users_view, name='search_users'),
    path('privacypolicy', views.privacy_policy_view, name='privacy_policy'),
    path('userdatadeletion', views.user_data_deletion_view, name='user_data_deletion'),
    path('termsofservice', views.terms_of_service_view, name='terms_of_service'),


]