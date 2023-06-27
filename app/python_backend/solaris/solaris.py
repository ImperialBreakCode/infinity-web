from flask import Blueprint, render_template

sol = Blueprint('solaris', __name__, template_folder='templates', url_prefix='/solaris')


@sol.route('/')
def solaris():
    return render_template('Solaris.html', location='home')


@sol.route('/<page>')
def pages(page):
    return render_template('Solaris.html', location=page)
