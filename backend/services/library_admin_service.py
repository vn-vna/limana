import contextlib

from context import app_context
from clients.sqlite_client import SqliteClient

SQL_CREATE_AUTHOR_TABLE = """
    CREATE TABLE IF NOT EXISTS {author_table} (
        authorid    CHAR(30)        PRIMARY KEY,
        firstname   NVARCHAR(50),
        lastname    NVARCHAR(50),
        address     NVARCHAR(255),
        phonenum    CHAR(12)
    );
"""

SQL_INSERT_NEW_AUTHOR = """
    INSERT INTO
        {author_table} (
            authorid,
            firstname,
            lastname,
            address,
            phonenum
        )
    VALUES
        (?, ?, ?, ?, ?);
"""


class LibraryAdminService(app_context.AppService):
    def __init__(self):
        super().__init__()

        self.db = SqliteClient()

    def start(self):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_CREATE_AUTHOR_TABLE.format(
                author_table=self.db.authordb_name.value
            ))

            self.db.connection.commit()

    def stop(self):
        pass

    def add_book(self, book):
        raise NotImplementedError()

    def remove_book(self, book):
        raise NotImplementedError()

    def update_book(self, book):
        raise NotImplementedError()

    def add_author(self, author: dict):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_INSERT_NEW_AUTHOR.format(
                author_table=self.db.authordb_name.value
            ), (
                author.get("authorid"),
                author.get("firstname"),
                author.get("lastname"),
                author.get("address"),
                author.get("phonenum")
            ))
            self.db.connection.commit()

    def remove_author(self, author):
        raise NotImplementedError()

    def update_author(self, author):
        raise NotImplementedError()

    def add_publisher(self, publisher):
        raise NotImplementedError()

    def remove_publisher(self, publisher):
        raise NotImplementedError()

    def update_publisher(self, publisher):
        raise NotImplementedError()
