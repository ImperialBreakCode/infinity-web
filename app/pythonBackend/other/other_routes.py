from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user

from .setup_edit_form import SetupEditForm
from ..models import User, update_profile_pic
from ... import db


other = Blueprint('other', __name__, template_folder='templates')


@other.route('/get-started')
@login_required
def get_started():
    if current_user.set:
        redirect(url_for('mainhub.main_home'))

    return render_template('get_started.html')


@other.route('/settings/<from_site>')
def settings(from_site):
    return render_template('others/settings.html', from_site=from_site)


@other.route('/setup', methods=['GET', 'POST'])
@login_required
def setup_account():

    if current_user.set:
        return redirect(url_for('mainhub.main_home'))

    setup_form = SetupEditForm()

    if setup_form.validate_on_submit():
        user = User.query.filter_by(id=current_user.id).first()
        user.name = setup_form.name.data
        user.followers = setup_form.followers.data
        user.following = setup_form.following.data
        user.bio = setup_form.bio.data

        if 'cropped-img' in request.files:
            cropped_img = request.files['cropped-img']
            cropped_img_data = request.files['cropped-img'].read()
            update_profile_pic(blob=cropped_img, user_pic=user.profile_pic, img_data=cropped_img_data)

        user.set = True

        db.session.commit()

        flash('your account is set')

        if 'cropped-img' in request.files:
            return ''

        return redirect(url_for('mainhub.main_home'))

    return render_template('others/edit_setup_profile.html', title='Setup account', form=setup_form, image=current_user.profile_pic)