import phonenumbers
from django.db import transaction
from django.contrib.auth.hashers import check_password
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Item
from django.core.validators import validate_email
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError


from .models import SupportMail

class SupportMailForm(forms.ModelForm):
    class Meta:
        model = SupportMail
        fields = ['name', 'email', 'message']


class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['title', 'description', 'city',
                  'required_investment', 'profit_number', 'user', 'category']


class SignupForm(UserCreationForm):
    """
        Форма для регистрацию через почту
    """
    first_name = forms.CharField(label='Имя', max_length=30)
    last_name = forms.CharField(label='Фамилия', max_length=30)
    avatar = forms.ImageField(label='аватар')
    username = forms.CharField(
        max_length=60,
        required=True,
        error_messages={
            "required": "Обязательное поле"
        }
    )
    email = forms.EmailField(
        max_length=50,
        required=True,
        error_messages={
            "required": "Обязательное поле"
        }
    )
    phone = forms.CharField(
        max_length=32,
        required=True,
        error_messages={
            "required": "Обязательное поле"
        }
    )
    interest = forms.ChoiceField(
        label='Меня больше интересует',
        required=True,
        widget=forms.RadioSelect,
        choices=[('investing', 'Инвестиции'),
                 ('project', 'Привлечение денег в свои проекты')]
    )
    password1 = forms.CharField(
        max_length=32,
        min_length=5,
        required=True,
        error_messages={
            "required": "Обязательное поле",
            "min_length": "Минимум 5 знаков",
        }
    )
    password2 = forms.CharField(
        required=True,
        widget=forms.PasswordInput(attrs={
            "required": "Обязательное поле",
            "placeholder": "Повторить пароль",
        })
    )
    class Meta:
        """
            Конфигурация формы
        """
        model = User
        fields = ("first_name","last_name","username", "email", "password1", "password2","avatar")


    def clean_username(self):
        if not self.cleaned_data['username'].strip():
            raise forms.ValidationError("Обязательное поле")
        elif len(self.cleaned_data['username']) < 5:
            raise forms.ValidationError("Минимум 5 знаков")
        else:
            return self.cleaned_data['first_name'] + '_' + self.cleaned_data['last_name']
        
    
    def clean_email(self):
        try:
            validate_email(self.cleaned_data["email"])
        except ValidationError:
            raise forms.ValidationError("Укажите корректную почту")
        if User.objects.filter(email=self.cleaned_data["email"]).exists():
            raise forms.ValidationError("Почта уже зарегистрирована")
        return self.cleaned_data["email"]
    
    
    def clean_phone(self):
        try:
            parse_phone = phonenumbers.parse(self.cleaned_data['phone'], None)
            if not phonenumbers.is_valid_number(parse_phone):
                raise ValidationError("Неверный номер телефона")
        except phonenumbers.phonenumberutil.NumberParseException:
            raise ValidationError("Неверный номер телефона")
        return self.cleaned_data['phone']
    
    
    def clean_password2(self):
        cdata = self.cleaned_data
        print(cdata)
        if "password2" not in cdata:
            raise forms.ValidationError("Минимум 5 знаков")
        if cdata["password1"] != cdata["password2"]:
            raise forms.ValidationError("Пароли не совпадают")
        else:
            return cdata["password2"]
        
    
class SignIn(forms.ModelForm):
    email_or_username = forms.CharField(
        max_length=50,
        required=True,
        error_messages={
            "required": "Обязательное поле"
        }
    )
    password = forms.CharField(
        max_length=32,
        min_length=5,
        required=True,
        error_messages={
            "required": "Обязательное поле",
            "min_length": "Минимум 5 знаков",
        }
    )

    class Meta:
        """
            Конфигурация формы
        """
        model = User
        fields = ("email_or_username",'password')
    
    def clean_email(self):
        if '@' in self.cleaned_data['email_or_username']:
            try:
                validate_email(self.cleaned_data["email"])
            except ValidationError:
                raise forms.ValidationError("Укажите корректную почту")
            if not User.objects.filter(email=self.cleaned_data["email_or_username"]).exists():
                raise forms.ValidationError("Неправильные данные")
            return self.cleaned_data["email"]
        else:
            if not User.objects.filter(username=self.cleaned_data['email_or_username']).exists():
                raise forms.ValidationError('Неправильные данные')
            return self.cleaned_data['email_or_username']