import argparse
import logging
import os

from context.app_controller import AppController
from utils.singleton import SingletonObject


class Application(SingletonObject):
    def __init__(self):
        self._controller = AppController()
        self._argparser = argparse.ArgumentParser()

        self._argparser.add_argument(
            "-e", "--env",
            action="append",
            dest="env_list",
            help="Modify environment variables")

    def start(self):
        args = self._argparser.parse_args()

        if args.env_list is not None:
            for env in args.env_list:
                key, value = env.split("=")
                os.environ[key] = value

        self._controller.run()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    Application().start()
