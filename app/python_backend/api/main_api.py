from flask import Blueprint
from flask_restful import Api, Resource
from flask import request

from ..infinity_library import validate_jwt
from ..models import InstagramPost, Comments

api_blueprint = Blueprint('main_api', __name__, url_prefix='/api')
api = Api(api_blueprint)


class GetInstagramPosts(Resource):
    def get(self):

        token = request.args.get('token')
        post_id = request.args.get('id')
        user_email = request.args.get('user')

        token_decoded = validate_jwt(token)
        if token_decoded:
            post_dict_list = []

            if post_id is not None:
                posts = InstagramPost.query.filter_by(id=post_id)
            else:
                posts = InstagramPost.query.all()

            for post in posts:
                if user_email is not None:
                    if post.user.email == user_email:
                        post_dict_list.append(post.to_dictionary())
                else:
                    post_dict_list.append(post.to_dictionary())

            return post_dict_list, 200

        return {'message': 'Invalid token'}, 401


class GetInstagramComments(Resource):
    def get(self):

        token = request.args.get('token')
        comment_id = request.args.get('id')
        user_email = request.args.get('user')

        token_decoded = validate_jwt(token)
        if token_decoded:
            comment_dict_list = []

            if comment_id is not None:
                comments = Comments.query.filter_by(id=comment_id)
            else:
                comments = Comments.query.all()

            for comment in comments:
                if user_email is not None:
                    if comment.user.email == user_email:
                        comment_dict_list.append(comment.to_dictionary())
                else:
                    comment_dict_list.append(comment.to_dictionary())

            return comment_dict_list, 200

        return {'message': 'Invalid token'}, 401


api.add_resource(GetInstagramPosts, '/instagram-posts')
api.add_resource(GetInstagramComments, '/comments')
