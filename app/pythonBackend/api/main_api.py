from flask import Blueprint
from flask_restful import Api, Resource

from ..infinity_library import validate_jwt
from ..models import InstagramPost

api_blueprint = Blueprint('main_api', __name__, url_prefix='/api')
api = Api(api_blueprint)


class GetDatabaseData(Resource):
    def get(self):

        token_decoded = validate_jwt()

        if token_decoded:

            post_dict_list = []
            posts = InstagramPost.query.all()
            for post in posts:
                post_dict_list.append(post.to_dictionary())

            return post_dict_list, 200

        return {'message': 'Invalid token'}, 401


api.add_resource(GetDatabaseData, '/test')
