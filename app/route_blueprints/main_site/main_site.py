from flask import Blueprint, render_template

mains = Blueprint('mainSite', __name__, template_folder='templates', url_prefix='/infinity')


@mains.route('/')
def home():
    return render_template('main_site/pages/home.html')


@mains.route('/posts')
def posts():
    return render_template('main_site/pages/main_site_posts.html')


@mains.route('/about')
def about():
    return render_template('main_site/pages/main_site_about.html')
