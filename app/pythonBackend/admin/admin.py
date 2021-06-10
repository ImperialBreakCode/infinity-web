from flask_admin import AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user

from ... import login_manager
from ... import db
from ..models import User, UserProfilePic, InstagramPost, Comments


class AdminIndex(AdminIndexView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.admin

    def inaccessible_callback(self, name, **kwargs):
        return login_manager.unauthorized()


class AdminModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.admin

    def inaccessible_callback(self, name, **kwargs):
        return login_manager.unauthorized()


class UserModelView(AdminModelView):
    column_searchable_list = ['email', 'name']


class ProfilePicView(AdminModelView):
    def formatter(view, context, model, name):
        stripped_content = model.image
        return stripped_content[:100] + '...'
    column_formatters = dict(image=formatter)


class InstagramPostView(AdminModelView):
    def formatter(view, context, model, name):
        stripped_content = model.image
        return stripped_content[:100] + '...'
    column_formatters = dict(image=formatter)


model_views = {
    UserModelView(User, db.session),
    ProfilePicView(UserProfilePic, db.session),
    InstagramPostView(InstagramPost, db.session),
    AdminModelView(Comments, db.session)
}