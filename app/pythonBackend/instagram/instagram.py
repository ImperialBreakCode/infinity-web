from flask import Blueprint, render_template, redirect, url_for, request, make_response, jsonify
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from datetime import datetime
import math

from ..other.setup_edit_form import SetupEditForm
from ..instagram.create_post_form import CreatePostForm
from ..infinity_library import set_logged, setup_acc_required, covert_image_post
from ..models import User, InstagramPost, Comments, update_profile_pic
from ... import db


instagram = Blueprint('instagram', __name__, template_folder='templates', url_prefix='/instagram')


@instagram.route('/', methods=['GET', 'DELETE'])
@setup_acc_required
def home():

    if request.method == 'DELETE':
        if 'type' in request.form:
            data = request.form['type'].split('-')
            if data[0] == 'dp':
                post = InstagramPost.query.filter_by(id=data[1]).first()
                if post is not None and post.user == current_user:
                    db.session.delete(post)
                    db.session.commit()

    all_users = User.query.all()
    posts = InstagramPost.query.all()
    posts_len = len(posts)

    return render_template('instagram/pages/home.html', title='', logged=set_logged(), users=all_users, math=math, posts=posts, posts_len=posts_len, len=len)


@instagram.route('/explore')
@setup_acc_required
def explore():
    return render_template('instagram/pages/under_construction.html', page='Explore', title=' • Explore', logged=set_logged())


@instagram.route('/reels')
@setup_acc_required
def reels():
    return render_template('instagram/pages/under_construction.html', page='Reels', title=' • Reels', logged=set_logged())


@instagram.route('/shop')
@setup_acc_required
def shop():
    return render_template('instagram/pages/under_construction.html', page='Shop', title=' • Shop', logged=set_logged())


@instagram.route('/my-profile')
@login_required
@setup_acc_required
def my_profile():
    posts = current_user.instagram_posts

    calculated_data = calculate_posts_and_rows(posts)

    return render_template('instagram/pages/my_profile.html',
                           title=' • My Profile',
                           logged=True,
                           user=current_user,
                           math=math,
                           rows=calculated_data[1],
                           posts=posts,
                           posts_on_row=calculated_data[0],
                           len=len
                           )


@instagram.route('/create-post', methods=['GET', 'POST'])
@login_required
@setup_acc_required
def create_post():
    cr_post = CreatePostForm()

    if cr_post.validate_on_submit():
        caption = cr_post.caption.data.strip()
        img = cr_post.image.data
        img = covert_image_post(image=img, filename=secure_filename(img.filename))

        insta_post = InstagramPost(created_at=datetime.now(),
                                   caption=caption,
                                   image_name=img[2],
                                   mime_type=img[1],
                                   image=img[0]
                                   )

        user = User.query.filter_by(id=current_user.id).first()
        user.instagram_posts.append(insta_post)

        db.session.add(insta_post)

        db.session.commit()

        return redirect(url_for('instagram.home'))

    return render_template('instagram/pages/create_post.html', form=cr_post)


@instagram.route('/profile/<id>')
@setup_acc_required
def user_profile(id):
    user = User.query.filter_by(id=id).first()

    if user is not None and user.set:

        if current_user.is_authenticated and current_user.id == user.id:
            return redirect(url_for('instagram.my_profile'))

        if current_user.is_authenticated or not user.private_profile:
            posts = user.instagram_posts

            calculated_data = calculate_posts_and_rows(posts)

            return render_template('instagram/pages/my_profile.html',
                                   title='• {0}'.format(user.name),
                                   logged=set_logged(),
                                   user=user,
                                   math=math,
                                   posts=posts,
                                   rows=calculated_data[1],
                                   posts_on_row=calculated_data[0],
                                   len=len
                                   )

    return make_response(), 404


@instagram.route('/post/<id>/<from_page>', methods=['GET', 'POST', 'DELETE'])
@setup_acc_required
def post(id, from_page):
    post = InstagramPost.query.filter_by(id=id).first()
    comments_count = len(post.comments)

    if current_user.is_authenticated or not post.user.private_profile:

        if request.method == 'POST':
            if 'delete-post' in request.form:
                if post is not None and current_user == post.user:
                    db.session.delete(post)
                    db.session.commit()

                if from_page == 'h':
                    return redirect(url_for('instagram.home'))
                else:
                    return redirect(url_for('instagram.my_profile'))

        if request.method == 'DELETE':
            delete_comment()

        return render_template('instagram/pages/post.html', from_page=from_page, post=post, cm_count=comments_count)

    else:
        return make_response(), 404


@instagram.route('/edit-profile/<from_page>', methods=['GET', 'POST'])
@login_required
@setup_acc_required
def edit_profile(from_page):

    edit_profile_form = SetupEditForm()

    if request.method == 'GET':
        edit_profile_form.name.data = current_user.name
        if edit_profile_form.followers.data is None:
            edit_profile_form.followers.data = current_user.followers
        if edit_profile_form.following.data is None:
            edit_profile_form.following.data = current_user.following
        edit_profile_form.bio.data = current_user.bio

    if edit_profile_form.validate_on_submit():
        user = User.query.filter_by(id=current_user.id).first()
        user.name = edit_profile_form.name.data
        user.followers = edit_profile_form.followers.data
        user.following = edit_profile_form.following.data
        user.bio = edit_profile_form.bio.data

        if edit_profile_form.cropped_img.data != '':
            blob_url = edit_profile_form.cropped_img.data
            update_profile_pic(blob_url=blob_url, user_pic=user.profile_pic)

        db.session.commit()

        if 'cropped-img' in request.files:
            return ''

        if from_page == 'h':
            return redirect(url_for('instagram.home'))

        return redirect(url_for('instagram.my_profile'))

    return render_template('others/edit_setup_profile.html', form=edit_profile_form, title='Instagram • Edit profile', image=current_user.profile_pic, from_page=from_page)


# help functions
#

def delete_comment():
    data = request.form['type']
    type = data.split('-')[0]

    if type == 'dc':
        cmt_id = data.split('-')[1]
        comment = Comments.query.filter_by(id=cmt_id).first()

        if comment is not None and comment.user == current_user:
            db.session.delete(comment)
            db.session.commit()


def calculate_posts_and_rows(posts):
    posts_count = len(posts)
    rows = math.ceil(posts_count / 3)
    last_row_ps = posts_count - (rows - 1) * 3
    posts_on_row = []

    post_index_fist = 0
    for r in range(rows):
        if r == 0:
            post_index_fist += last_row_ps - 1
        else:
            post_index_fist += 3
        posts_on_row.append(post_index_fist)

    return [posts_on_row, rows]
