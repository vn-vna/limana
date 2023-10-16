import envsubst
import yaml
from typing import Optional, Type, Callable
from threading import Lock

from utils.singleton import SingletonObject


class ConfigValue:
    def __init__(self, pattern, config, cast):
        self._pattern = pattern
        self._config = config
        self._cast = cast
        self._lock = Lock()

        self._hash_val = None
        self._cache_val = None

    @property
    def value(self):
        with self._lock:
            if self._hash_val != self._config._chash:
                self._cache_val = self._dive()

        return self._cache_val

    def _dive(self):
        path = self._pattern.split("::")

        crr_section = self._config._data
        for section in path:
            crr_section = crr_section.get(section)

        if self._cast is not None:
            return self._cast(crr_section)

        return crr_section


class AppConfig(SingletonObject):
    _data: dict
    _chash: int

    def __init__(self, config_file: str = "config/config-default.yaml"):
        self.config_file = config_file
        self.reload_config()

    def reload_config(self):
        with open(self.config_file) as file:
            content = file.read()
            content = envsubst.envsubst(content)
            self._chash = hash(content)
            self._data = yaml.safe_load(content)

    def get(self, pattern: str, cast_to: type = str):
        return ConfigValue(pattern, self, cast_to)


if __name__ == "__main__":
    cfg = AppConfig()
    mc = cfg.get("my::config")

    print(mc.value)
