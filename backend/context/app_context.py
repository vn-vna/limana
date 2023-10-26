from utils.singleton import SingletonObject
from context import app_config


class AppService(SingletonObject):
    def __init__(self):
        self._config = app_config.AppConfig()

    def start(self):
        raise RuntimeError("Not implemented")

    def stop(self):
        raise RuntimeError("Not implemented")
