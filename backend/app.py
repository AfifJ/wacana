from flask import Flask

""" 
project/
    api/
        model/
            __init__.py
            welcome.py
        route/
            home.py
        schema/
            __init__.py
            welcome.py
        service
            __init__.py
            welcome.py

    test/
        route/
            __init__.py
            test_home.py
        __init.py

    .gitignore
    app.py
    Pipfile
    Pipfile.lock
    README.md
    requirements.txt
    setup.py
"""

app = Flask(__name__)

@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello, World'