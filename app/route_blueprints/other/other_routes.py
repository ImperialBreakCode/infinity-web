from flask import Blueprint, render_template

other = Blueprint('other', __name__, template_folder='templates')


@other.route('/get-started')
def get_started():
    return render_template('get_started.html')


@other.route('/settings/<from_site>')
def settings(from_site):
    return render_template('others/settings.html', from_site=from_site)
