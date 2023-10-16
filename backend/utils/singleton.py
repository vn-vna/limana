from threading import Lock


class SingletonMeta(type):
    _instances = {}
    _lock: Lock = Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance

        return cls._instances[cls]


class SingletonObject(metaclass=SingletonMeta):
    pass


if __name__ == "__main__":
    class SO(SingletonObject):
        def __init__(self):
            print("Called init")


    a = SO()
    b = SO()

    print(a == b)
