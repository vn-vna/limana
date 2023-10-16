import waitress
from flask import Flask

from utils.singleton import SingletonObject


class AppController(SingletonObject):
    def __init__(self):
        self._flask_app = Flask("limana")
        self._init_flask_app()

    def _init_flask_app(self):
        from route.home import home_blueprint
        self._flask_app.register_blueprint(blueprint=home_blueprint)

    def run(self):
        waitress.serve(self._flask_app, host="*", port=8080)
