import logging


class GenericObjectMeta(type):
    def __call__(cls, *args, **kwargs):
        instance = super().__call__(*args, **kwargs)
        instance._logger = logging.getLogger(cls.__name__)
        return instance


class Object(metaclass=GenericObjectMeta):
    _logger: logging.Logger

    @property
    def logger(self):
        return self._logger
