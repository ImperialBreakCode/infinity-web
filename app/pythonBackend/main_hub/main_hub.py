from flask import Blueprint, render_template
from ..infinity_library import set_logged

mh = Blueprint('mainhub', __name__, template_folder='templates')


@mh.route('/')
def main_home():
    return render_template('main_hub.html', logged=set_logged())
