from flask import Blueprint, request
from flask_restful import Api, Resource

solaris_api_bp = Blueprint('solaris_api', __name__, url_prefix='/solaris-api')
solaris_api = Api(solaris_api_bp)


class GetPage(Resource):
    def get(self, page):
        try:
            with open(f'app/static/solaris/mains/{page}.txt') as main_content:
                data = make_data(main_content=main_content, page_name=page)
        except:
            with open(f'app/static/solaris/mains/under_constr.txt', 'r') as main_content:
                data = make_data(main_content=main_content, page_name='under_constr')

        return data


solaris_api.add_resource(GetPage, '/pages/<string:page>')


def make_data(main_content, page_name):
    main = main_content.read()

    if page_name == 'home':
        css = ''
    else:
        css = f'/static/solaris/css/{page_name}.css'

    return {'main': main, 'css_link': css}
