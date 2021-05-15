from flask import Flask

#todo icon, mainpage, accounts, api, fix paragraphs image, adpin panel, mail, titles

def create_app():
    app = Flask(__name__)

    from .route_blueprints.main_site.main_site import mains
    app.register_blueprint(mains)

    from .route_blueprints.instagram.instagram import instagram
    app.register_blueprint(instagram)

    from .route_blueprints.main_hub.main_hub import mh
    app.register_blueprint(mh)

    from .route_blueprints.auth.auth import auth
    app.register_blueprint(auth)

    return app
