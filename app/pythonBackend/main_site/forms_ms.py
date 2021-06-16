from flask_wtf import FlaskForm
from wtforms import SelectField, SubmitField, StringField, TextAreaField
from flask_ckeditor import CKEditorField
from wtforms.validators import DataRequired


class Filters(FlaskForm):
    post_types = SelectField('Post types', id='post-type-select',
                             choices=[('1', 'Articles'), ('2', 'Instagram posts')],
                             render_kw={
                                 'class': 'form-select form-select-lg mb-3'
                             },
                             default='1'
                             )
    account_post = SelectField('From account', id='account-select', choices=[('1', 'All')], default=1, render_kw={
        'class': 'form-select form-select-lg mb-3'
    })
    get_results = SubmitField('Get Results', render_kw={
        'class': 'btn btn-danger btn-lg move-b'
    })


class ContactForm(FlaskForm):
    title = StringField('Title', id='input-title-contact', validators=[DataRequired()], render_kw={
        'class': 'form-control',
        'placeholder': 'Title',
    })
    message = TextAreaField('Message', id='input-message-contact', validators=[DataRequired()], render_kw={
        'class': 'form-control',
        'placeholder': 'Text...',
        'rows': '4'
    })
    send_button = SubmitField('Send', render_kw={
        'class': 'btn btn-primary w-100 mt-3'
    })


class CreateEditArticleForm(FlaskForm):
    title = StringField('Title', id='input-title-article', validators=[DataRequired()], render_kw={
        'class': 'form-control',
        'placeholder': 'Title'
    })
    content = CKEditorField('Content', id='input-content-article', validators=[DataRequired()], render_kw={
        'class': 'form-control',
        'placeholder': 'Text...',
        'rows': '5'
    })
    create_edit = SubmitField('Create', render_kw={
        'class': 'btn btn-primary'
    })
