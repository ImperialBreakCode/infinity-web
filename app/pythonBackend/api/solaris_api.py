from flask import Blueprint, jsonify
from flask_restful import Api, Resource
import json

solaris_api_bp = Blueprint('solaris_api', __name__, url_prefix='/solaris-api')
solaris_api = Api(solaris_api_bp)


class GetPage(Resource):
    def get(self, page):

        page = page.replace('-', '_')

        try:
            with open(f'app/static/solaris/mains/{page}.txt') as main_content:
                data = make_data(main_content=main_content, page_name=page)
        except:
            with open(f'app/static/solaris/mains/under_constr.txt', 'r') as main_content:
                data = make_data(main_content=main_content, page_name='under_constr')

        return data


class GetLightsaberTags(Resource):
    def get(self):
        with open('app/static/solaris/javascript/lightsaber/script_tags.json') as content:
            json_data = json.loads(content.read())

        return json_data


solaris_api.add_resource(GetPage, '/pages/<string:page>')
solaris_api.add_resource(GetLightsaberTags, '/shader-lightsaber-script-tags')


def make_data(main_content, page_name):
    main = main_content.read()

    if page_name == 'home':
        css = ''
        javascript = ''
    else:
        css = f'/static/solaris/css/{page_name}.css'
        javascript = f'/static/solaris/javascript/{page_name}.js'

    return {'main': main, 'css_link': css, 'javascript_link': javascript}
