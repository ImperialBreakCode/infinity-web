from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy_utils import database_exists
from flask_migrate import Migrate
from flask_admin import Admin


db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()
admin_panel = Admin(template_mode='bootstrap4')


def create_app():

    # creating app
    app = Flask(__name__)

    # configuring app
    app.config.from_mapping(
        SECRET_KEY='a55dzssftnnvd88er;,iuijkjyuiyui',
        SQLALCHEMY_DATABASE_URI='postgres://bmtgzpwbkqrijw:6e0f0a305dba66ddf05e48120887fe3d8b41b884d2b1e5c727dc814640ba311d@ec2-3-212-75-25.compute-1.amazonaws.com:5432/da60litc8116en',
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    # initialising with app
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

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
