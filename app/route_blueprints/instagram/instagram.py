from flask import Blueprint, render_template

instagram = Blueprint('instagram', __name__, template_folder='templates', url_prefix='/instagram')


@instagram.route('/')
def home():
    return render_template('instagram/pages/home.html')


@instagram.route('/explore')
def explore():
    return render_template('instagram/pages/under_construction.html', page='Explore')


@instagram.route('/reels')
def reels():
    return render_template('instagram/pages/under_construction.html', page='Reels')


@instagram.route('/shop')
def shop():
    return render_template('instagram/pages/under_construction.html', page='Shop')


@instagram.route('/my-profile')
def my_profile():
    return render_template('instagram/pages/my_profile.html')


@instagram.route('/edit-profile/<from_site>')
def edit_profile(from_site):
    return render_template('others/edit-profile.html', from_site=from_site)

