import waitress
from flask import Flask

from utils.singleton import SingletonObject
from context import app_config


class AppController(SingletonObject):
    def __init__(self):
        self._flask_app = Flask("limana")
        self._config = app_config.AppConfig()

        self._host = self._config.get("server::host", "localhost")
        self._port = self._config.get("server::port", 8080, cast_to=int)

        self._init_flask_app()

    def _init_flask_app(self):
        from route.home import home_blueprint
        self._flask_app.register_blueprint(blueprint=home_blueprint)
        from route.lmao import lmao_blueprint
        self._flask_app.register_blueprint(blueprint=lmao_blueprint)


    def run(self):
        waitress.serve(
            app=self._flask_app, 
            host=self._host.value, 
            port=self._port.value)
