from flask import Blueprint, request
from flask_restful import Api, Resource
import datetime, jwt, base64, random, os

from ..models import ApiLoginRequest, User
from ..infinity_library import generate_api_login_key
from ... import db

main_api_login_bp = Blueprint('main_api_login', __name__, url_prefix='/api/api-login')
main_api_login = Api(main_api_login_bp)


# request login string
#


class RequestedLogin(Resource):
    def get(self):
        request_str = ''

        # it won't create request string if there are too many string in the database
        if len(ApiLoginRequest.query.all()) > 50:
            return {'message': 'fail', 'request_id': ''}

        # generate string
        for i in range(10):
            r = random.randint(97, 122)
            c = random.choice([1, 2])
            if c == 1:
                request_str += str(r)
            else:
                request_str += chr(r)

        # create login request string object for database
        expire_date = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(minutes=1)
        login_request = ApiLoginRequest(request_string=request_str, expire_date=expire_date)

        # save the object in the database
        db.session.add(login_request)
        db.session.commit()

        return {'message': 'success', 'request_id': request_str}


# logging with credentials and generated key from the request string
#


class LoginApi(Resource):
    def post(self, request_string):
        # getting login request object from database
        login_request = ApiLoginRequest.query.filter_by(request_string=request_string).first()

        # if no request return 404
        if login_request is None:
            return 'not found', 404

        # delete object from database
        db.session.delete(login_request)
        db.session.commit()

        # checking if request is expired
        now = datetime.datetime.now(tz=datetime.timezone.utc).replace(tzinfo=None)
        if login_request.expire_date > now:

            # checking keys

            data_credentials = request.data.decode().split('-')
            generated_key = generate_api_login_key(rq_string=request_string)
            received_key = data_credentials[0]

            if received_key == generated_key:

                email = base64.b64decode(data_credentials[1]).decode()
                password = base64.b64decode(data_credentials[2]).decode()

                token_dict = generate_token(email, password)
                if token_dict:
                    return token_dict, 200
            return 'failed', 401

        return 'failed', 401


class GenerateToken(Resource):
    def post(self):
        data_credentials = request.data.decode().split('-')
        email = base64.b64decode(data_credentials[0]).decode()
        password = base64.b64decode(data_credentials[1]).decode()

        token_dict = generate_token(email, password)
        if token_dict:
            return token_dict, 200

        return 'failed', 401


if os.environ['API_IMG_LG'] == 'True':
    main_api_login.add_resource(RequestedLogin, '/')
    main_api_login.add_resource(LoginApi, '/<string:request_string>')
else:
    main_api_login.add_resource(GenerateToken, '/')


def generate_token(email, password):
    user = User.query.filter_by(email=email).first()

    if user is not None and user.check_password(password=password):
        exp = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(minutes=10)
        private_key = os.environ['PRIVATE_KEY']
        payload = {'exp': exp, 'email': user.email}
        token = jwt.encode(payload, private_key, algorithm='RS256')

        return {'token': token}
    return False
