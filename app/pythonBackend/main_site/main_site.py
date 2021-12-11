from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_required, current_user
from flask_mail import Message
import datetime

from .forms_ms import Filters, ContactForm, CreateEditArticleForm
from ..infinity_library import set_logged, setup_acc_required
from ..models import User, InstagramPost, Article
from ... import db, mail

mains = Blueprint('mainSite', __name__, template_folder='templates', url_prefix='/infinity')


@mains.route('/')
@setup_acc_required
def home():
    return render_template('main_site/pages/home.html', title='', logged=set_logged())


@mains.route('/posts', methods=['GET', 'POST', 'DELETE'])
@setup_acc_required
def posts():
    post_type = ''
    posts = []
    articles = []

    filters = Filters()
    accounts = User.query.all()

    # delete article if requested
    if request.method == 'DELETE':
        if 'type' in request.form:
            data = request.form['type'].split('-')
            if data[0] == 'da':
                article_for_deletion = Article.query.filter_by(id=int(data[1])).first()
                if article_for_deletion is not None and current_user == article_for_deletion.user:
                    db.session.delete(article_for_deletion)
                    db.session.commit()

    # populate form
    for i, account in enumerate(accounts):
        filters.account_post.choices.append((i + 2, account.email))

    # if there is post request coming from the filters the default selections are going to be changed
    if filters.validate_on_submit():
        filters.account_post.default = filters.account_post.data
        filters.post_types.default = filters.post_types.data

    # getting the form post type which is the default selection
    default = filters.post_types.default
    post_type = filters.post_types.choices[int(default) - 1][1]

    # getting the post owner setting which is the default selection
    default = filters.account_post.default
    from_acc = filters.account_post.choices[int(default) - 1][1]

    # getting the posts and articles
    if from_acc == 'All':
        posts = InstagramPost.query.all()
        articles = Article.query.all()
    else:
        posts = User.query.filter_by(email=from_acc).first().instagram_posts
        articles = User.query.filter_by(email=from_acc).first().articles

    # rendering html content
    return render_template('main_site/pages/main_site_posts.html',
                           title=' • Posts',
                           filters=filters,
                           logged=set_logged(),
                           type=post_type,
                           posts=posts,
                           articles=articles,
                           len=len
                           )


@mains.route('/about', methods=['GET', 'POST'])
@setup_acc_required
def about():
    contact_form = ContactForm()

    if contact_form.validate_on_submit():
        msg_title = contact_form.title.data
        msg_content = contact_form.message.data
        user = 'no-account'
        if current_user.is_authenticated:
            user = current_user.email

        message = 'From: {0}; Message: {1}'.format(user, msg_content)

        msg = Message(
            subject=msg_title,
            recipients=['eeeda522@gmail.com'],
            body=message
        )

        mail.send(msg)

        flash('message sent')

        return redirect(url_for('mainSite.about') + '#msg')

    return render_template('main_site/pages/main_site_about.html', title=' • About', contact_form=contact_form, logged=set_logged())


@mains.route('/create-article', methods=['GET', 'POST'])
@login_required
@setup_acc_required
def create_article():

    cr_article = CreateEditArticleForm()

    if cr_article.validate_on_submit():
        title = cr_article.title.data
        content = cr_article.content.data

        user = User.query.filter_by(id=current_user.id).first()
        article = Article(title=title, content=content, created_at=datetime.datetime.now(tz=datetime.timezone.utc))
        user.articles.append(article)

        db.session.add(article)

        db.session.commit()

        return redirect(url_for('mainSite.posts'))

    return render_template('main_site/pages/article_create_edit.html', form=cr_article, edit=False)


@mains.route('/edit-article/<art_id>', methods=['GET', 'POST'])
@login_required
@setup_acc_required
def edit_article(art_id):

    article = Article.query.filter_by(id=art_id).first()
    edit_form = CreateEditArticleForm()

    if request.method == 'GET':
        edit_form.title.data = article.title
        edit_form.content.data = article.content

    if edit_form.validate_on_submit():
        article.title = edit_form.title.data
        article.content = edit_form.content.data

        db.session.commit()

        return redirect(url_for('mainSite.posts'))

    return render_template('main_site/pages/article_create_edit.html', form=edit_form, edit=True)
