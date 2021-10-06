from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy_utils import database_exists
from flask_migrate import Migrate
from flask_admin import Admin
from flask_ckeditor import CKEditor
from flask_mail import Mail
from dotenv import load_dotenv
import os


db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()
admin_panel = Admin(template_mode='bootstrap4')
ckeditor = CKEditor()
mail = Mail()


def create_app():

    load_dotenv()

    # sqlite:///pythonBackend/database.sqlite

    # creating app
    app = Flask(__name__)

    # configuring app
    app.config.from_mapping(
        SECRET_KEY=os.environ['SECRET_KEY'],
        SQLALCHEMY_DATABASE_URI=os.environ['SQLALCHEMY_DATABASE_URI'],
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        CKEDITOR_PKG_TYPE='standard',
        MAIL_SERVER=os.environ['MAIL_SERVER'],
        MAIL_PORT=os.environ['MAIL_PORT'],
        MAIL_USERNAME=os.environ['MAIL_USERNAME'],
        MAIL_PASSWORD=os.environ['MAIL_PASSWORD'],
        MAIL_USE_TLS=True,
        MAIL_DEFAULT_SENDER=os.environ['MAIL_DEFAULT_SENDER']
    )

    # initialising with app
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    ckeditor.init_app(app)
    mail.init_app(app)

    from .pythonBackend.admin.admin import AdminIndex
    admin_panel.init_app(app, index_view=AdminIndex())

    # registering route blueprints
    from .pythonBackend.main_site.main_site import mains
    app.register_blueprint(mains)

    from .pythonBackend.instagram.instagram import instagram
    app.register_blueprint(instagram)

    from .pythonBackend.main_hub.main_hub import mh
    app.register_blueprint(mh)

    from .pythonBackend.auth.auth import auth
    app.register_blueprint(auth)

    from .pythonBackend.other.other_routes import other
    app.register_blueprint(other)

    from .pythonBackend.solaris.solaris import sol
    app.register_blueprint(sol)

    # registering apis
    from .pythonBackend.api.api_for_front_end import front_end_api
    app.register_blueprint(front_end_api)

    from .pythonBackend.api.solaris_api import solaris_api_bp
    app.register_blueprint(solaris_api_bp)

    # registering command blueprints
    from .pythonBackend.commands import bp_command
    app.register_blueprint(bp_command)

    # adding admin panel views
    from .pythonBackend.admin.admin import model_views
    admin_panel.add_views(*model_views)

    # database
    with app.app_context():
        if not database_exists(db.engine.url):
            db.create_all()

    return app
