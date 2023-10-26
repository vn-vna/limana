from __future__ import annotations

import logging
import os.path
from threading import Lock, Event
from typing import Type, Dict

import envsubst
import yaml
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

from utils.singleton import SingletonObject


class ConfigFileWatcher(FileSystemEventHandler):
    def __init__(self, config: AppConfig):
        self._config = config

    def on_modified(self, event):
        if os.path.abspath(event.src_path) == os.path.abspath(self._config.config_file):
            self._config.reload_config()


class ConfigValue:
    def __init__(self, pattern: str, config: AppConfig, default: any, cast: Type):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._default = default

        self._pattern = pattern
        self._config = config
        self._cast = cast
        self._lock = Lock()

        self._hash_val = None
        self._cache_val = None

    @property
    def value(self):
        with self._lock:
            if self._hash_val != self._config.config_hash:
                self._config.wait_for_reload()
                self._cache_val = self._dive()

        return self._cache_val

    def _dive(self):
        path = self._pattern.split("::")

        crr_section = self._config.data
        for section in path:
            if crr_section is None:
                break
            crr_section = crr_section.get(section)

        if self._cast is not None:
            return self._cast(crr_section)

        if crr_section is None:
            return self._default

        return crr_section


class AppConfig(SingletonObject):
    _data: Dict
    _chash: int

    def __init__(self, config_file: str = "config/config-default.yaml"):
        self.config_file = config_file
        self._cfg_guard = Event()

        self.reload_config()

        self._observer = Observer()
        self._change_handler = ConfigFileWatcher(self)

        self._observer.schedule(self._change_handler, os.path.dirname(self.config_file))
        self._observer.start()

    def wait_for_reload(self):
        self._cfg_guard.wait()

    def reload_config(self, *args, **kwargs):
        with open(self.config_file) as file:
            self._cfg_guard.clear()

            content = file.read()
            content = envsubst.envsubst(content)
            self._chash = hash(content)
            self._data = yaml.safe_load(content)

            self._cfg_guard.set()

    def get(self, pattern: str, default = None, cast_to: type = str):
        return ConfigValue(pattern, self, default, cast_to)

    @property
    def config_hash(self):
        return self._chash

    @property
    def data(self):
        return self._data


if __name__ == "__main__":
    cfg = AppConfig()
    mc = cfg.get("my::config")

    while input("Check? ") == "y":
        print(mc.value)
