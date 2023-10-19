import argparse
import logging
import os

from context.app_controller import AppController
from context.app_config import AppConfig
from utils.singleton import SingletonObject


class Application(SingletonObject):
    def __init__(self):
        self._config = None
        self._argparser = None
        self._controller = None

    def _configure_logging(self):
        configured_level = self._config.get("logging::level", "INFO").value
        configured_format = self._config.get("logging::format", "%(asctime)s %(levelname)s %(message)s").value
        logging.basicConfig(
            level=logging.getLevelName(configured_level),
            format=configured_format)

    def start(self):
        self._argparser = argparse.ArgumentParser()

        self._argparser.add_argument(
            "-e", "--env",
            action="append",
            dest="env_list",
            help="Modify environment variables")

        self._argparser.add_argument(
            "-c", "--config",
            action="store",
            dest="config_file",
            help="Configuration file",
            default="config/config-default.yaml")

        args = self._argparser.parse_args()

        self._config = AppConfig(args.config_file)
        self._configure_logging()
        self._controller = AppController()

        if args.env_list is not None:
            for env in args.env_list:
                key, value = env.split("=")
                os.environ[key] = value

        self._controller.run()
