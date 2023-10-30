from __future__ import annotations

import sqlite3
import os.path
from threading import Lock, current_thread

from context import app_config
from utils.singleton import SingletonObject


class SqliteClient(SingletonObject):

    def __init__(self):
        super().__init__()

        self._config = app_config.AppConfig()
        self._db_path = self._config.get("database::sqlite::dbloc")
        self._db_uri = os.path.join(os.getcwd(), self._db_path.value)
        self._lock = Lock()

        self._connections = {}

        # Define table names
        self.authdb_name = self._config.get("database::sqlite::tables::auth")
        self.sessiondb_name = self._config.get("database::sqlite::tables::session")
        self.bookdb_name = self._config.get("database::sqlite::tables::book")

    def get_cursor(self) -> sqlite3.Cursor:
        return self.connection.cursor()

    @property
    def connection(self) -> sqlite3.Connection:
        with self._lock:
            if current_thread().name not in self._connections:
                self._connections[current_thread().name] = sqlite3.connect(self._db_uri)

            return self._connections[current_thread().name]

    def destroy(self):
        with self._lock:
            for connection in self._connections.values():
                connection.close()

