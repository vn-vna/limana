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

        self._init_services()

    def _init_flask_app(self):
        from route.home import home_blueprint
        self._flask_app.register_blueprint(home_blueprint)

        from route.authentication import auth_blueprint
        self._flask_app.register_blueprint(auth_blueprint)

        from route.book_manager import book_manager_blueprint
        self._flask_app.register_blueprint(book_manager_blueprint)

        from route.author_manager import author_mng_blueprint
        self._flask_app.register_blueprint(author_mng_blueprint)

        from route.publisher_manager import publisher_manager_blueprint
        self._flask_app.register_blueprint(publisher_manager_blueprint)

    def _init_services(self):
        from services.authentication_service import AuthenticationService
        from services.library_admin_service import LibraryAdminService

        self._authentication_service = AuthenticationService()
        self._library_admin_service = LibraryAdminService()

    def run(self):
        self._authentication_service.start()
        self._library_admin_service.start()

        waitress.serve(
            app=self._flask_app,
            host=self._host.value,
            port=self._port.value)
