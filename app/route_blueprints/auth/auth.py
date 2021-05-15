from flask import Blueprint, render_template

auth = Blueprint('auth', __name__, template_folder='templates')


@auth.route('/login')
def login():
    return render_template('auth.html')
