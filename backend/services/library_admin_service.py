import contextlib

from context import app_context
from clients.sqlite_client import SqliteClient
import uuid

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

SQL_DELETE_AUTHOR = """
    DELETE FROM {author_table} WHERE authorid = ?;
"""
SQL_UPDATE_AUTHOR = """
    UPDATE {author_table} SET
        firstname = ?,
        lastname = ?,
        address = ?,
        phonenum = ?
    WHERE  
        authorid = ?;
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
SQL_DELETE_PUBLISHER = """
    DELETE FROM {publisher_table} WHERE publisherid = ?;
"""
SQL_UPDATE_PUBLISHER = """
    UPDATE {publisher_table} SET
        name = ?
    WHERE   
        publisherid = ?;
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
            bookid = uuid.uuid4().hex
            cursor.execute(SQL_INSERT_NEW_BOOK.format(
                book_table=self.db.bookdb_name.value
            ), (
                bookid,
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
            authorid = uuid.uuid4().hex
            cursor.execute(SQL_INSERT_NEW_AUTHOR.format(
                author_table=self.db.authordb_name.value
            ), (
                authorid,
                author.get("firstname"),
                author.get("lastname"),
                author.get("address"),
                author.get("phonenum")
            ))
            self.db.connection.commit()

    def remove_author(self, author):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_DELETE_AUTHOR.format(
                author_table=self.db.authordb_name.value
            ), (author.get("authorid"),))

    def update_author(self, author):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_UPDATE_AUTHOR.format(
                author_table=self.db.authordb_name.value
            ), (
                author.get("firstname"),
                author.get("lastname"),
                author.get("address"),
                author.get("phonenum"),
                author.get("authorid")
            ))

    def add_publisher(self, publisher):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            publisherid = uuid.uuid4().hex
            cursor.execute(SQL_INSERT_NEW_PUBLISHER.format(
                publisher_table=self.db.publisher_name.value
            ), (
                publisherid,
                publisher.get("name")
            ))
            self.db.connection.commit()

    def remove_publisher(self, publisher):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_DELETE_PUBLISHER.format(
                publisher_table=self.db.publisher_name.value
            ), (publisher.get("publisherid"),))

    def update_publisher(self, publisher):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_UPDATE_PUBLISHER.format(
                publisher_table=self.db.publisher_name.value
            ), (
                publisher.get("name"),
                publisher.get("publisherid")
            ))
