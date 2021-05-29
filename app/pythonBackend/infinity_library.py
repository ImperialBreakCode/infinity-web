from flask import redirect, url_for
from flask_login import current_user
from functools import wraps


def set_logged():
    if current_user.is_authenticated:
        return True
    else:
        return False


def setup_acc_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if current_user.is_authenticated and not current_user.set:
            return redirect(url_for('other.setup_account'))
        return func(*args, **kwargs)
    return wrapper
