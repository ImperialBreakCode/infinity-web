from flask import redirect, url_for
from flask_login import current_user
from functools import wraps
from PIL import Image
import os
import base64


def set_logged():
    if current_user.is_authenticated:
        return True
    else:
        return False


def setup_acc_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if current_user.is_authenticated and not current_user.set:
            return redirect(url_for('other.setup_account'))
        return func(*args, **kwargs)
    return wrapper


def covert_image_post(image, filename):
    new_img = []

    name = filename.rsplit('.', 1)
    img = Image.open(image)
    aspect_ratio = img.size[0] / img.size[1]

    if img.size[0] > 1920:
        width = 1920
        height = width / aspect_ratio
        img = img.resize((int(width), int(height)), resample=Image.HAMMING)

    if img.size[1] > 1080:
        height = 1080
        width = height * aspect_ratio
        img = img.resize((int(width), int(height)), resample=Image.HAMMING)

    jp_img = img.convert(mode='RGB')

    new_filename = 'app/pythonBackend/images/tmp/{0}.jpg'.format(name[0])
    img_name = '{0}.jpg'.format(name[0])
    jp_img.save(new_filename)

    with open(new_filename, 'rb') as new_img_file:
        data = new_img_file.read()
        data = base64.b64encode(data)
        data = data.decode('UTF-8')

        mime = 'image/jpeg'

        new_img = [data, mime, img_name]

    os.remove(new_filename)

    return new_img
