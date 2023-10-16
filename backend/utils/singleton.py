from threading import Lock

from utils.generic_object import GenericObjectMeta


class SingletonMeta(GenericObjectMeta):
    _instances = {}
    _init_locks = {}
    _singleton_lock = Lock()

    def __call__(cls, *args, **kwargs):
        with cls._singleton_lock:
            if cls not in cls._init_locks:
                cls._init_locks[cls] = Lock()

        with cls._init_locks[cls]:
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance

        return cls._instances[cls]


class SingletonObject(metaclass=SingletonMeta):
    @property
    def logger(self):
        return self._logger


if __name__ == "__main__":
    class SO(SingletonObject):
        def __init__(self):
            print("Called init")


    a = SO()
    b = SO()

    print(a == b)
