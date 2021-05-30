from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import login_required, current_user
import math

from ..other.setup_edit_form import SetupEditForm
from ..infinity_library import set_logged, setup_acc_required
from ..models import User, update_profile_pic
from ... import db


instagram = Blueprint('instagram', __name__, template_folder='templates', url_prefix='/instagram')


@instagram.route('/')
@setup_acc_required
def home():
    all_users = User.query.all()

    return render_template('instagram/pages/home.html', title='', logged=set_logged(), users=all_users, math=math)


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
    return render_template('instagram/pages/my_profile.html', title=' • My Profile', logged=True, user=current_user, math=math)


@instagram.route('/profile/<id>')
@setup_acc_required
def user_profile(id):
    user = User.query.filter_by(id=id).first()
    if user is not None and user.set:
        return render_template('instagram/pages/my_profile.html', title='• {0}'.format(user.name), logged=set_logged(), user=user, math=math)
    return 'User not found', 404


@instagram.route('/edit-profile', methods=['GET', 'POST'])
@login_required
@setup_acc_required
def edit_profile():

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

        return redirect(url_for('instagram.my_profile'))

    return render_template('others/edit_setup_profile.html', form=edit_profile_form, title='Instagram • Edit profile', image=current_user.profile_pic)
