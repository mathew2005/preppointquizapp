from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import auth
from .models import Profile
from quiz.models import QuizSubmission

from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
# from django.contrib import messages

# from django.contrib.auth.tokens import default_token_generator
# from django.utils.encoding import force_str
# from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model
# from django.shortcuts import render, redirect
# from django.contrib import messages

# from django.conf import settings
# Create your views here.

from django.http import HttpResponse

from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required

from django.db.models.signals import post_save
from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from .models import Profile

User = get_user_model()


    
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(user_signed_up)
def user_signed_up_handler(request, user, **kwargs):
    # This function is called when a user signs up
    # You can create a profile for the user here
     if not hasattr(user, 'profile'):
        Profile.objects.create(user=user)

# def verify_email(request, uidb64, token):
#     try:
#         uid = force_str(urlsafe_base64_decode(uidb64))
#         user = User.objects.get(pk=uid)
#     except (TypeError, ValueError, OverflowError, User.DoesNotExist):
#         user = None

#     if user is not None and default_token_generator.check_token(user, token):
#         # Mark the user as active (email verified)
#         user.is_active = True
#         user.save()
#         messages.success(request, 'Your email has been verified. You can now log in.')
#         return redirect('login')  # Redirect to login page or any other page

#     # If verification fails, show an error message
#     messages.error(request, 'Invalid verification link. Please try again or contact support.')
#     return redirect('login')  # Redirect to login page or any other page


# def register(request):
#     if request.user.is_authenticated:
#         return redirect('profile', request.user.username)

#     if request.method == "POST":
#         email = request.POST['email']
#         username = request.POST['username']
#         password = request.POST['password']
#         password2 = request.POST['password2']

#         if password == password2:
#             if User.objects.filter(email=email).exists():
#                 messages.info(request, "Email Already Used. Try to Login.")
#                 return redirect('register')
            
#             elif User.objects.filter(username=username).exists():
#                 messages.info(request, "Username Already Taken.")
#                 return redirect('register')
            
#             else:
#                 user = User.objects.create_user(username=username, email=email, password=password)
#                 user.is_active = False  # User is not active until email is verified
#                 user.save()

#                 # Send verification email
#                 current_site = get_current_site(request)
#                 mail_subject = 'Activate your account'
#                 html_message = render_to_string('verification_email.html', {
#                     'user': user,
#                     'domain': current_site.domain,
#                     'uid': urlsafe_base64_encode(force_bytes(user.pk)),
#                     'token': default_token_generator.make_token(user),
#                 })
#                 to_email = [email]
#                 send_mail(mail_subject, None, None, to_email, html_message=html_message)

#                 messages.success(request, 'Please check your email to verify your account.')

#                 # create profile for new user
                # user_model = User.objects.get(username=username)
                # new_profile = Profile.objects.create(user=user_model)
                # new_profile.save()
                # # return redirect('profile', username)
                # return redirect('login')
#         else:
#             messages.info(request, "Password Not Matching.")
#             return redirect('register')

#     context = {}
#     return render(request, "register.html", context)


# create profile for new user
# def createProfile(request):
#     user_model = User.objects.get(username=username)
#     new_profile = Profile.objects.create(user=user_model)
#     new_profile.save()
#         # return redirect('profile', username)
#     return redirect('login')

@login_required(login_url='account_login')
def profile(request, username):
    # profile user
    user_object2 = User.objects.get(username=username)
    user_profile2 = Profile.objects.get(user=user_object2)

    # request user
    user_object = User.objects.get(username=request.user)
    user_profile = Profile.objects.get(user=user_object)

    submissions = QuizSubmission.objects.filter(user=user_object2)

    context = {"user_profile": user_profile, "user_profile2": user_profile2, "submissions":submissions}
    return render(request, "profile.html", context)

@login_required(login_url='account_login')
def editProfile(request):

    user_object = User.objects.get(username=request.user)
    user_profile = Profile.objects.get(user=user_object)

    if request.method == "POST":
        # Image
        if request.FILES.get('profile_img') != None:
            user_profile.profile_img = request.FILES.get('profile_img')
            user_profile.save()

        # Email
        if request.POST.get('email') != None:
            u = User.objects.filter(email=request.POST.get('email')).first()

            if u == None:
                user_object.email = request.POST.get('email')
                user_object.save()
            else:
                if u != user_object:
                    messages.info(request, "Email Already Used, Choose a different one!")
                    return redirect('edit_profile')

        # Username
        if request.POST.get('username') != None:
            u = User.objects.filter(username=request.POST.get('username')).first()

            if u == None:
                user_object.username = request.POST.get('username')
                user_object.save()
            else:
                if u != user_object:
                    messages.info(request, "Username Already Taken, Choose an unique one!")
                    return redirect('edit_profile')

        # firstname lastname
        user_object.first_name = request.POST.get('firstname')
        user_object.last_name = request.POST.get('lastname')
        user_object.save()

        # location , bio, gender
        # user_profile.location = request.POST.get('location')
        # user_profile.gender = request.POST.get('gender')
        user_profile.bio = request.POST.get('bio')
        user_profile.save()

        return redirect('profile', user_object.username)


    context = {"user_profile": user_profile}
    return render(request, 'profile-edit.html', context)


@login_required(login_url='account_login')
def deleteProfile(request):

    user_object = User.objects.get(username=request.user)
    user_profile = Profile.objects.get(user=user_object)

    if request.method == "POST":
        user_profile.delete()
        user_object.delete()
        return redirect('account_logout')



    context = {"user_profile": user_profile}
    return render(request, 'confirm.html', context)


# def login(request):
#     if request.user.is_authenticated:
#         return redirect('profile', request.user.username)

#     if request.method == "POST":
#         username = request.POST['username']
#         password = request.POST['password']

#         user = auth.authenticate(username=username, password=password)

#         if user is not None:
#             auth.login(request, user)
#             return redirect('profile', username)
#         else:
#             messages.info(request, 'Credentials Invalid!')
#             return redirect('login')

#     return render(request, "login.html")

# @login_required(login_url='account_login')
# def logout(request):
#     auth.logout(request)
#     return redirect('login')



