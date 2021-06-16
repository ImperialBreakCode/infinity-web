from flask_wtf import FlaskForm
from wtforms import PasswordField, SubmitField, BooleanField, RadioField
from wtforms.validators import DataRequired


class ChangePasswordForm(FlaskForm):
    current_pass = PasswordField('Current password', id='current-pass-input', validators=[DataRequired()], render_kw={
        'class': 'form-control'
    })
    new_pass = PasswordField('New password',
                             id='new-pass-input',
                             validators=[DataRequired()],
                             render_kw={'class': 'form-control'}
                             )
    confirm_pass = PasswordField('Confirm new password', id='conf-pass-input', validators=[DataRequired()], render_kw={
        'class': 'form-control'
    })
    submit = SubmitField('Change', render_kw={
        'class': 'btn btn-primary'
    })


class SettingsForm(FlaskForm):
    dark_theme = BooleanField('Instagram dark theme', id='dark-check', render_kw={
        'class': 'form-check-input'
    })
    private_profile = BooleanField('Private profile', id='private-profile-check', render_kw={
        'class': 'form-check-input'
    })
    insta_post_setting = RadioField('Instagram posts', choices=[
        ('0', 'Show posts in the main site and instagram'),
        ('1', 'Show posts only in the instagram page')
    ], default='0')
    articles_setting = BooleanField('Make articles invisible to non-account users', id='articles-check', render_kw={
        'class': 'form-check-input'
    })
    save = SubmitField('Save', render_kw={
        'class': 'btn btn-primary'
    })
