from flask import Flask
from application.auth.routes import auth
from application.articles.routes import articles

app = Flask(__name__)
app.register_blueprint(auth)
app.register_blueprint(articles)

@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello, World'

if __name__ == '__main__':
    app.run(debug=True)