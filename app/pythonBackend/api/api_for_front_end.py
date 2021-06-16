from flask import Blueprint, url_for, make_response, jsonify
from flask_login import login_required, current_user

from ..infinity_library import setup_acc_required


front_end_api = Blueprint('front_end_api', __name__, url_prefix='/fre-api')


@front_end_api.route('/gcud')
@login_required
@setup_acc_required
def get_cu_data():
    img_url = 'data:' + current_user.profile_pic.mime_type + ';base64,' + current_user.profile_pic.image
    acc_name = current_user.name
    profile_link = url_for('instagram.user_profile', id=current_user.id)
    res_data = {
        'profile_pic_url': img_url,
        'acc_name': acc_name,
        'profile_link': profile_link
    }
    return make_response(jsonify(res_data))
