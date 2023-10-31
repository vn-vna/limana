import contextlib

from context import app_context
from clients.sqlite_client import SqliteClient

SQL_CREATE_BOOK_TABLE = """ 
    CREATE TABLE IF NOT EXISTS {book_table} (
        bookid      CHAR(30)        PRIMARY KEY,
        title       NVARCHAR(50)    NOT NULL,
        authorname  NVARCHAR(50)    NOT NULL,
        publisher   NVARCHAR(50)    NOT NULL,
        publish_date        DATETIME        NOT NULL,
        number_instore      INT             NOT NULL
    );
"""

SQL_INSERT_NEW_BOOK = """   
    INSERT INTO 
        {book_table} (
            bookid,
            title,
            authorname,
            publisher,
            publish_date
            number_instore
        )   
    VALUES
        (?, ?, ?, ?, ?);
"""
SQL_DELETE_BOOK = """
    DELETE FROM {book_table} WHERE bookid = ?;
"""

SQL_UPDATE_BOOK = """
    UPDATE {book_table} SET
        title = ?,
        authorname = ?,
        publisher = ?,
        publish_date = ?,
        number_instore = ?
    WHERE   
        bookid = ?;
"""

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

SQL_CREATE_NEW_PUBLISHER = """
    CREATE TABLE IF NOT EXISTES {publisher_table} (
        publisherid CHAR(30)        PRIMARY KEY,
        name        NVARCHAR(50)    NOT NULL
    );
"""

SQL_INSERT_NEW_PUBLISHER = """
    INSERT INTO {publisher_table} (
        publisherid,
        name
    )
    VALUES
        (?, ?);
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

            cursor.execute(SQL_CREATE_BOOK_TABLE.format(
                book_table=self.db.bookdb_name.value
            ))
            self.db.connection.commit()

    def stop(self):
        pass

    def add_book(self, book):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_INSERT_NEW_BOOK.format(
                book_table=self.db.bookdb_name.value
            ), (
                book.get("bookid"),
                book.get("title"),
                book.get("authorname"),
                book.get("publisher"),
                book.get("publish_date"),
                book.get("number_instore")
            ))
            self.db.connection.commit()

    def remove_book(self, book):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_DELETE_BOOK.format(
                book_table=self.db.bookdb_name.value
            ), (book.get("bookid"),))

    def update_book(self, book):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_UPDATE_BOOK.format(
                book_table=self.db.bookdb_name.value
            ), (
                book.get("bookid")
            ))

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
