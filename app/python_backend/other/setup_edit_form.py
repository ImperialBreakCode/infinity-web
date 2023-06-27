from flask_wtf import FlaskForm
from wtforms import StringField, FileField, TextAreaField, SubmitField, IntegerField, HiddenField
from wtforms.validators import DataRequired, NumberRange


class SetupEditForm(FlaskForm):
    image_upload = FileField('Upload profile picture', id='formFileLg', render_kw={
        'class': 'form-control form-control-lg dark-input',
        'accept': 'image/*'
    })
    name = StringField('Name', id='account-name', validators=[DataRequired()], render_kw={
        'class': 'form-control dark-input'
    })
    followers = IntegerField('Number of followers', id='followers-input', validators=[DataRequired(), NumberRange(min=0, max=999999999)], render_kw={
        'class': 'form-control dark-input'
    })
    following = IntegerField('Number of following', id='following-input', validators=[DataRequired(), NumberRange(min=0, max=999999999)], render_kw={
        'class': 'form-control dark-input'
    })
    bio = TextAreaField('Bio', id='account-bio', render_kw={
        'class': 'form-control dark-input',
        'rows': '3'
    })
    cropped_img = HiddenField(id='cropped-img')
    save_button = SubmitField('Save', render_kw={
        'class': 'btn btn-primary'
    })