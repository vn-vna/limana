import argparse
import logging
import os

from context.app_controller import AppController
from context.app_config import AppConfig
from utils.singleton import SingletonObject


class Application(SingletonObject):
    def __init__(self):
        self._controller = AppController()
        self._config = AppConfig()
        self._argparser = argparse.ArgumentParser()

        self._argparser.add_argument(
            "-e", "--env",
            action="append",
            dest="env_list",
            help="Modify environment variables")

        self._configure_logging()

    def _configure_logging(self):
        configured_level = self._config.get("logging::level", "INFO").value
        configured_format = self._config.get("logging::format", "%(asctime)s %(levelname)s %(message)s").value
        logging.basicConfig(
            level=logging.getLevelName(configured_level),
            format=configured_format)

    def start(self):
        args = self._argparser.parse_args()

        if args.env_list is not None:
            for env in args.env_list:
                key, value = env.split("=")
                os.environ[key] = value

        self._controller.run()


if __name__ == "__main__":
    Application().start()
