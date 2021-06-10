from flask import Blueprint, render_template

from .forms_ms import Filters, ContactForm
from ..infinity_library import set_logged, setup_acc_required

mains = Blueprint('mainSite', __name__, template_folder='templates', url_prefix='/infinity')


@mains.route('/')
@setup_acc_required
def home():
    return render_template('main_site/pages/home.html', title='', logged=set_logged())


@mains.route('/posts')
@setup_acc_required
def posts():
    filters = Filters()
    return render_template('main_site/pages/main_site_posts.html', title=' • Posts', filters=filters, logged=set_logged())


@mains.route('/about')
@setup_acc_required
def about():
    contact_form = ContactForm()
    return render_template('main_site/pages/main_site_about.html', title=' • About', contact_form=contact_form, logged=set_logged())

