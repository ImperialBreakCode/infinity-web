from flask import Blueprint, render_template, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
import datetime

from .auth_forms import LogInForm, RegisterForm
from ..models import User, def_image
from ... import db

auth = Blueprint('auth', __name__, template_folder='templates')


@auth.route('/login', methods=['GET', 'POST'])
def login():
    lg_form = LogInForm()

    if current_user.is_authenticated:
        return redirect(url_for('mainhub.main_home'))

    if lg_form.validate_on_submit():
        email = lg_form.email.data
        password = lg_form.password.data

        user = User.query.filter_by(email=email).first()

        if user is not None and user.check_password(password):
            remember_duration = datetime.timedelta(days=3)

            login_user(user, remember=True, duration=remember_duration)

            if not user.set:
                return redirect(url_for('other.get_started'))

            flash('logged in as {0}'.format(user.email))

            return redirect(url_for('mainhub.main_home'))

        flash('invalid email or password')

    return render_template('auth.html', form=lg_form, title='Login')


@auth.route('/register', methods=['GET', 'POST'])
@login_required
def register():

    if not current_user.admin:
        return current_user.unauthorized()

    rg_form = RegisterForm()

    if rg_form.validate_on_submit():
        email = rg_form.email.data
        password = rg_form.password.data
        admin = rg_form.admin_acc.data

        new_user = User(email=email,
                        password=password,
                        admin=admin,
                        set=False,
                        created_at=datetime.datetime.now()
                        )
        db.session.add(new_user)

        profile_pic = def_image()
        new_user.profile_pic = profile_pic
        db.session.add(profile_pic)

        db.session.commit()

        flash('new account created')

        return redirect(url_for('mainhub.main_home'))

    return render_template('auth.html', form=rg_form, title='Register')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('logged out')
    return redirect(url_for('mainhub.main_home'))
