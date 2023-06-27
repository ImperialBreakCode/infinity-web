from flask import Blueprint, url_for, make_response, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone

from ..infinity_library import setup_acc_required
from ..models import User, InstagramPost, Comments
from ... import db


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


@front_end_api.route('/pc', methods=['POST'])
@login_required
@setup_acc_required
def post_comment_api():

    cmt_dat = request.get_json()
    if cmt_dat is None:
        cmt_dat = dict()

    cmt = post_comment(cmt_data=cmt_dat)
    if cmt == 204:
        return make_response(), 204
    return make_response(jsonify({'id': cmt.id}))


# post comment
def post_comment(cmt_data):
    if 'type' in cmt_data:
        type = cmt_data['type'].split('-')
        if type[0] == 'pc':
            id = type[1]
            content = cmt_data.get('content').strip()

            if content != '':
                user = User.query.filter_by(id=current_user.id).first()
                post = InstagramPost.query.filter_by(id=id).first()

                comment = Comments(content=content, created_at=datetime.now(tz=timezone.utc))

                user.comments.append(comment)
                db.session.add(comment)
                db.session.commit()

                post.comments.append(comment)
                db.session.commit()

                return comment

    return 204
