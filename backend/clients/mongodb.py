import pymongo

from context import app_config
from utils.singleton import SingletonObject


class MongoClient(SingletonObject):
    def __init__(self):
        self._config = app_config.AppConfig()

        self._host = self._config.get("database::mongodb::host")
        self._port = self._config.get("database::mongodb::port")
        self._db_name = self._config.get("database::mongodb::db_name")

        self._user = self._config.get("database::mongodb::username")
        self._password = self._config.get("database::mongodb::password")

        if self._user is not None and self._password is not None:
            self._uri = f"mongodb://{self._user.value}:{self._password.value}@{self._host.value}:{self._port.value}"
        else:
            self._uri = f"mongodb://{self._host.value}:{self._port.value}"

        self._client = pymongo.MongoClient(self._uri)
        self._db = self._client[self._db_name.value]

    @property
    def db(self):
        return self._db


if __name__ == "__main__":
    # Some tests

    client = MongoClient()
    db = client.db

    # Insert some data
    db["users"].insert_one({"name": "John", "age": 30})
    db["users"].insert_one({"name": "Jimmy", "age": 30})
    db["users"].insert_one({"name": "Jane", "age": 30})

    # Print some data
    print(db.list_collection_names())
    print(db["users"].find_one())
