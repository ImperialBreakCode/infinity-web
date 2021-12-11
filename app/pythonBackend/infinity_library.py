import datetime

from flask import redirect, url_for, request
from flask_login import current_user
from functools import wraps
from PIL import Image
from urllib.parse import quote
from jwt import exceptions
import io, os
import base64
import jwt


class ModelToDict:
    def to_dictionary(self):
        obj_dict = {}
        for col in self.__table__.columns:
            attr = getattr(self, col.name)
            if isinstance(attr, datetime.datetime):
                obj_dict[col.name] = attr.timestamp() * 1000
            else:
                obj_dict[col.name] = attr

        return obj_dict


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


def validate_jwt():
    token = request.args.get('token')
    if token:
        public_key = os.environ['PUBLIC_KEY']
        try:
            decoded = jwt.decode(token, public_key, algorithms=['RS256'], options={'require': ['exp', 'email']})
            return decoded
        except:
            pass
    return False


def generate_api_login_key(rq_string):
    api_img = Image.open('app/pythonBackend/images/api_lg.jpg')
    pixels = api_img.load()

    new_char_array = []
    x = 0

    for i, char in enumerate(rq_string):
        if len(rq_string) % 2 == 1 and i == len(rq_string) - 1:
            new_char_array.append(char)
            break

        if i % 2 == 1:
            y = ord(char)
            new_char_array.append(chr(pixels[x, y][0] + x % 10))
            new_char_array.append(chr(pixels[x, y][1]))
            new_char_array.append(chr(pixels[x, y][2] + y % 5))
        else:
            x = ord(char)

    key_string = ''
    for c in new_char_array:
        key_string += c
    key_string = quote(key_string)

    key_string = key_string.split('%')
    for i, str_element in enumerate(key_string):
        if len(str_element) < 2:
            continue
        sub_string = str_element[0:2]
        new_sub = '\\u00' + sub_string.lower()
        new_sub = new_sub.encode().decode('unicode-escape')
        key_string[i] = str_element.replace(sub_string, new_sub)

    encoded_key = ''
    for s in key_string:
        encoded_key += s

    return base64.b64encode(encoded_key.encode()).decode()


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

    buffer = io.BytesIO()

    new_filename = '{0}.jpg'.format(name[0])
    jp_img.save(buffer, format='JPEG')

    blob = buffer.getvalue()
    data = base64.b64encode(blob)
    data = data.decode('UTF-8')
    mime = 'image/jpeg'
    new_img = [data, mime, new_filename]

    return new_img
