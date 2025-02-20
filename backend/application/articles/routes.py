from flask import Blueprint
articles = Blueprint('articles', __name__, url_prefix='/articles')

@articles.route('/')
def index():
    return 'Articles'