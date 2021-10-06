from flask import Blueprint, render_template

sol = Blueprint('solaris', __name__, template_folder='templates')


@sol.route('/solaris')
def solaris():
    return render_template('Solaris.html')
