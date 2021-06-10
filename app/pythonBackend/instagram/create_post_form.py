from flask_wtf import FlaskForm
from wtforms import TextAreaField, FileField, SubmitField
from wtforms.validators import DataRequired


class CreatePostForm(FlaskForm):
    caption = TextAreaField('Caption', id='caption-input', render_kw={
        'class': 'form-control',
        'placeholder': 'Write a caption...',
        'rows': '3'
    })
    image = FileField('Upload image', id='file-input', validators=[DataRequired()], render_kw={
        'class': 'form-control',
        'accept': 'image/*'
    })
    submit = SubmitField('Post')