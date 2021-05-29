from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, InputRequired


class LogInForm(FlaskForm):
    email = StringField('Email address', id='floatingInput', validators=[DataRequired()], render_kw={
        'type': 'email',
        'class': 'form-control',
        'placeholder': 'name@example.com'
    })
    password = PasswordField('Password', id='floatingPassword', validators=[DataRequired()], render_kw={
        'class': 'form-control',
        'placeholder': 'Password'
    })
    login_button = SubmitField('Sign In', render_kw={
        'class': 'custom-btn'
    })


class RegisterForm(FlaskForm):

    email = StringField('Email address', id='floatingInput', validators=[DataRequired()], render_kw={
        'class': 'form-control',
        'placeholder': 'name@example.com'
    })
    password = PasswordField('Password', id='floatingPassword', validators=[DataRequired()], render_kw={
        'class': 'form-control',
        'placeholder': 'Password'
    })
    admin_acc = BooleanField('Admin', id='checkAdmin', render_kw={
        'class': 'form-check-input'
    })
    reg_button = SubmitField('Register', render_kw={
        'class': 'custom-btn'
    })
