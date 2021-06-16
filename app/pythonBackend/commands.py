from flask import Blueprint

from .. import db
from .models import User, def_image
import datetime


bp_command = Blueprint('main-cmd', __name__)


@bp_command.cli.command('su-create')
def create_su():
    email = 'admin@infinity.acc'
    password = 'georgia123'

    if User.query.filter_by(email=email).first() is None:
        super_user = User(email=email, password=password, admin=True, set=False, created_at=datetime.datetime.now())
        db.session.add(super_user)

        prf_pic = def_image(super_user.id)
        super_user.profile_pic = prf_pic
        db.session.add(prf_pic)

        db.session.commit()

        print('done')
    else:
        print('already exists')


@bp_command.cli.command('tb-create')
def create_tables():
    db.create_all()
    print('created tables')


@bp_command.cli.command('st-populate')
def settings_populate():
    users = User.query.all()

    for user in users:
        user.dark_theme = False
        user.private_profile = False
        user.instagram_post_visibility = 0
        user.private_articles = False

        db.session.commit()

    print('populated')
