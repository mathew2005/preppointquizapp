from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from user.models import Profile
from .models import Quiz, Category, QuizSetting
from django.db.models import Q
from quiz.models import QuizSubmission
from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .forms import QuizSettingForm  # Import the form class


# Create your views here.

@login_required(login_url='account_login')
def all_quiz_view(request):

    user_object = User.objects.get(username=request.user)
    user_profile = Profile.objects.get(user=user_object)

    quizzes = Quiz.objects.order_by('title')
    categories = Category.objects.all()

    context = {"user_profile": user_profile, "quizzes": quizzes, "categories": categories}
    return render(request, 'all-quiz.html', context)

@login_required(login_url='account_login')
def search_view(request, category):

    user_object = User.objects.get(username=request.user)
    user_profile = Profile.objects.get(user=user_object)

    # search by search bar
    if request.GET.get('q') != None:
        q = request.GET.get('q')
        query = Q(title__icontains=q) | Q(description__icontains=q)
        quizzes = Quiz.objects.filter(query).order_by('-created_at')
    
    # search by category
    elif category != " ":
        quizzes = Quiz.objects.filter(category__name=category).order_by('-created_at')
    
    else:
        quizzes = Quiz.objects.order_by('-created_at')


    categories = Category.objects.all()

    context = {"user_profile": user_profile, "quizzes": quizzes, "categories": categories}
    return render(request, 'all-quiz.html', context)

@login_required(login_url='account_login')
def quiz_view(request, quiz_id):
    user_object = User.objects.get(username=request.user)
    user_profile = Profile.objects.get(user=user_object)
    quiz_settings, created = QuizSetting.objects.get_or_create(user=user_object)

    quiz = Quiz.objects.filter(id=quiz_id).first()
    quizObject = get_object_or_404(Quiz, id=quiz_id)
    quizTimer =quizObject.quizTimer
    if quiz != None:
        context = {"user_profile": user_profile, "quiz": quiz, "quizTimer" : quizTimer, 'quiz_settings': quiz_settings}
    else:
        return redirect('all_quiz')

    total_questions = quiz.question_set.all().count()

    if request.method == "POST":
        
        # Get the score
        score = request.POST['score']


        # Check if the user has already submiited the quiz
        if QuizSubmission.objects.filter(user=request.user, quiz=quiz).exists():
            submission = get_object_or_404(QuizSubmission, user=request.user, quiz=quiz)
            submission.score = score
            submission.save()
          
        else:
            submission = QuizSubmission(user=request.user, quiz=quiz, score=score)
            submission.save()

    return render(request, 'quiz.html', context)

@login_required(login_url='account_login')
def quiz_settings(request):

    # user_object = User.objects.get(username=request.user)
    

    user_object = request.user
    user_profile = Profile.objects.get(user=user_object)
    
    quiz_settings, created = QuizSetting.objects.get_or_create(user=user_object)


    if request.method == 'POST':
        form = QuizSettingForm(request.POST, instance=quiz_settings)
        if form.is_valid():
            form.save()
            messages.success(request, "Settings successfully changed")
            return redirect('quiz_settings')
    else:
        form = QuizSettingForm(instance=quiz_settings)

    context = {'quiz_settings': quiz_settings, 'form': form, "user_profile": user_profile}
    return render(request, 'quiz_settings.html', context)



