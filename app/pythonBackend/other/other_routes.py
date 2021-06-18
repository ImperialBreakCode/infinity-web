from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user

from .setup_edit_form import SetupEditForm
from .settings_forms import ChangePasswordForm, SettingsForm
from ..infinity_library import setup_acc_required
from ..models import User, update_profile_pic
from ... import db


other = Blueprint('other', __name__, template_folder='templates')


@other.route('/get-started')
@login_required
def get_started():
    if current_user.set:
        redirect(url_for('mainhub.main_home'))

    return render_template('get_started.html')


@other.route('/settings/<from_site>', methods=['GET', 'POST'])
@login_required
@setup_acc_required
def settings(from_site):

    change_pass = ChangePasswordForm()
    main_settings = SettingsForm()

    user = User.query.filter_by(id=current_user.id).first()

    # populate setting form if request is get
    if request.method == 'GET':
        main_settings.insta_post_setting.default = user.instagram_post_visibility
        main_settings.process()

        main_settings.dark_theme.data = user.dark_theme
        main_settings.private_profile.data = user.private_profile
        main_settings.articles_setting.data = user.private_articles

    # changing password if requested
    if change_pass.validate_on_submit():

        current_pass = change_pass.current_pass.data
        new_pass = change_pass.new_pass.data
        confirm_pass = change_pass.confirm_pass.data

        if len(new_pass) >= 8:
            if current_user.check_password(current_pass):
                if new_pass == confirm_pass:

                    user.password = new_pass

                    db.session.commit()

                    flash('Password changed', 'message')
                else:
                    flash('Failed to confirm the new password', 'error')
            else:
                flash('Current password incorrect.', 'error')
        else:
            flash('Your new password must be at least 8 symbols long.', 'error')

        return redirect(url_for('other.settings', from_site=from_site))

    # changing settings if requested
    if main_settings.validate_on_submit():
        user.dark_theme = main_settings.dark_theme.data
        user.private_profile = main_settings.private_profile.data
        if main_settings.insta_post_setting.data == '0' or main_settings.insta_post_setting.data == '1':
            user.instagram_post_visibility = main_settings.insta_post_setting.data
        user.private_articles = main_settings.articles_setting.data

        db.session.commit()

        if from_site == 'main':
            return redirect(url_for('mainSite.home'))
        elif from_site == 'mprf':
            return redirect(url_for('instagram.my_profile'))
        else:
            return redirect(url_for('instagram.home'))

    return render_template('others/settings.html', from_site=from_site, change_pass_form=change_pass, settings=main_settings)


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

        if setup_form.cropped_img.data != '':
            blob_url = setup_form.cropped_img.data
            update_profile_pic(blob_url=blob_url, user_pic=user.profile_pic)

        user.dark_theme = False
        user.private_profile = False
        user.instagram_post_visibility = 0
        user.private_articles = False

        user.set = True

        db.session.commit()

        flash('your account is set')

        if 'cropped-img' in request.files:
            return ''

        return redirect(url_for('mainhub.main_home'))

    return render_template('others/edit_setup_profile.html', title='Setup account', form=setup_form, image=current_user.profile_pic)