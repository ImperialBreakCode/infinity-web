from flask_login import UserMixin, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import base64

from .. import db, login_manager


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, unique=True, primary_key=True, index=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    admin = db.Column(db.Boolean, nullable=False)
    set = db.Column(db.Boolean, nullable=False)
    profile_pic = db.relationship('UserProfilePic', backref='user', lazy=True, uselist=False)
    name = db.Column(db.String(50), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    followers = db.Column(db.Integer)
    following = db.Column(db.Integer)
    created_at = db.Column(db.String(50), nullable=False)

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


class UserProfilePic(db.Model):
    __tablename__ = 'profile_pic'
    id = db.Column(db.Integer, unique=True, primary_key=True, index=True)
    image = db.Column(db.Text, nullable=False)
    img_name = db.Column(db.Text, nullable=False)
    mime_type = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


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


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)
