from flask_login import UserMixin, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import base64

from .. import db, login_manager


#
#
# models ===============================================================================================================
#
#


# user model
#
#

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, unique=True, primary_key=True, index=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    admin = db.Column(db.Boolean, nullable=False)
    set = db.Column(db.Boolean, nullable=False)
    name = db.Column(db.String(50), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    followers = db.Column(db.Integer)
    following = db.Column(db.Integer)
    created_at = db.Column(db.String(50), nullable=False)
    profile_pic = db.relationship('UserProfilePic', backref='user', lazy=True, uselist=False)
    instagram_posts = db.relationship('InstagramPost', backref='user', lazy=True)
    comments = db.relationship('Comments', backref='user', lazy=True)

    @property
    def password(self):
        raise AttributeError('password not accessible')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __str__(self):
        return self.email


# profile picture model
#
#

class UserProfilePic(db.Model):
    __tablename__ = 'profile_pic'
    id = db.Column(db.Integer, unique=True, primary_key=True, index=True)
    image = db.Column(db.Text, nullable=False)
    img_name = db.Column(db.Text, nullable=False)
    mime_type = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


# instagram post (image) model
#
#

class InstagramPost(db.Model):
    __tablename__ = 'instagram_post'
    id = db.Column(db.Integer, unique=True, primary_key=True, index=True)
    created_at = db.Column(db.String(50), nullable=False)
    caption = db.Column(db.Text)
    image_name = db.Column(db.Text, nullable=False)
    mime_type = db.Column(db.String(50), nullable=False)
    image = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comments = db.relationship('Comments', backref='post', cascade='all, delete-orphan', lazy=True)

    def __str__(self):
        return 'Post: {0} User: {1}'.format(self.id, self.user_id)


# comment model
#
#

class Comments(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, unique=True, primary_key=True, index=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('instagram_post.id'))


#
#
# methods and functions to make it easier to work with the models ======================================================
#
#


def def_image(email):
    with open('app/pythonBackend/images/profile_def.jpg', 'rb') as image:
        data = base64.b64encode(image.read())
        data = data.decode('UTF-8')
        profile_img = UserProfilePic(image=data, img_name='default_profile_pic.jpg', mime_type='image/jpeg')
        return profile_img


def update_profile_pic(blob_url, user_pic):
    data_url = blob_url.split(':', 1)[1]

    data_split = data_url.split(';', 1)
    mime = data_split[0]

    if mime != 'image/jpeg':
        mime = 'image/jpeg'

    img_data = data_split[1].split(',', 1)[1]

    user_pic.image = img_data
    user_pic.img_name = 'Profile_picture_{0}.jpg'.format(current_user.email.split('@')[0])
    user_pic.mime_type = mime


#
#
# loading user if there was a session ==================================================================================
#
#


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)
