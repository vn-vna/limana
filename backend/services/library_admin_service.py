import contextlib

from context import app_context
from clients.sqlite_client import SqliteClient
import uuid

SQL_CREATE_BOOK_TABLE = """ 
    CREATE TABLE IF NOT EXISTS {book_table} (
        bookid          CHAR(30)        PRIMARY KEY,
        title           NVARCHAR(250)   NOT NULL,
        authorid        CHAR(50),
        publisherid     CHAR(50),
        publish_date    DATETIME        NOT NULL,
        number_instore  INT             NOT NULL
    );
"""

SQL_INSERT_NEW_BOOK = """   
    INSERT INTO 
        {book_table} (
            bookid,
            title,
            authorid,
            publisherid,
            publish_date,
            number_instore
        )   
    VALUES
        (?, ?, ?, ?, ?, ?);
"""

SQL_DELETE_BOOK = """
    DELETE FROM {book_table} WHERE bookid = ?;
"""

SQL_UPDATE_BOOK = """
    UPDATE {book_table} SET
        title = ?,
        authorid = ?,
        publisherid = ?,
        publish_date = ?,
        number_instore = ?
    WHERE   
        bookid = ?;
"""

SQL_GET_ALL_BOOKS = """
    SELECT  
        {book_table}.bookid,
        {book_table}.title,
        {author_table}.authorid,
        {author_table}.firstname || ' ' || {author_table}.lastname AS authorname,
        {publisher_table}.name AS publisher,
        {book_table}.publish_date,
        {book_table}.number_instore
    FROM
        {book_table}
    JOIN {author_table} ON {book_table}.authorid = {author_table}.authorid
    JOIN {publisher_table} ON {book_table}.publisherid = {publisher_table}.publisherid
    WHERE
        {book_table}.title LIKE ? AND
        {publisher_table}.name LIKE ? AND
        ({author_table}.firstname || ' ' || {author_table}.lastname) LIKE ? AND
        {book_table}.publish_date BETWEEN ? AND ?;
"""

## ------------------ Author ------------------ ##

SQL_CREATE_AUTHOR_TABLE = """
    CREATE TABLE IF NOT EXISTS {author_table} (
        authorid    CHAR(30)        PRIMARY KEY,
        firstname   NVARCHAR(50),
        lastname    NVARCHAR(50),
        address     NVARCHAR(255),
        phonenum    CHAR(12)
    );
"""

SQL_GET_ALL_AUTHORS = """
    SELECT
        authorid,
        firstname,
        lastname,
        address,
        phonenum
    FROM
        {author_table}
    WHERE
        (firstname || ' ' || lastname) LIKE ? AND
        address LIKE ? AND
        phonenum LIKE ?;
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

## ------------------ Author ------------------ ##

## ------------------ Publisher ------------------ ##
SQL_CREATE_PUBLISHER_TABLE = """
    CREATE TABLE IF NOT EXISTS {publisher_table} (
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

SQL_GET_ALL_PUBLISHERS = """
    SELECT 
        publisherid,
        name
    FROM
        {publisher_table}
    WHERE
        name LIKE ?;
"""


## ------------------ Publisher ------------------ ##


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

            cursor.execute(SQL_CREATE_PUBLISHER_TABLE.format(
                publisher_table=self.db.publisher_name.value
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
                book.get("authorid"),
                book.get("publisherid"),
                book.get("pubdate"),
                book.get("instore")
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

    def get_all_books(self, query):
        # Get books and search by title, authorname, publisher, publish_date range
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_ALL_BOOKS.format(
                book_table=self.db.bookdb_name.value,
                author_table=self.db.authordb_name.value,
                publisher_table=self.db.publisher_name.value
            ), [
                "%" + query.get("title") + "%",
                "%" + query.get("publisher") + "%",
                "%" + query.get("author") + "%",
                query.get("pubfrom"),
                query.get("pubto")
            ])

            books = cursor.fetchall()

            return [
                {
                    "bookid": book[0],
                    "title": book[1],
                    "authorid": book[2],
                    "authorname": book[3],
                    "publisher": book[4],
                    "publish_date": book[5],
                    "number_instore": book[6]
                }
                for book in books
            ]

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

            self.db.connection.commit()

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

            self.db.connection.commit()

    def get_all_authors(self, query):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_ALL_AUTHORS.format(
                author_table=self.db.authordb_name.value
            ), [
                "%" + query.get("authorname") + "%",
                "%" + query.get("address") + "%",
                "%" + query.get("phonenum") + "%"
            ])

            authors = cursor.fetchall()

            return [
                {
                    "id": author[0],
                    "firstname": author[1],
                    "lastname": author[2],
                    "address": author[3],
                    "phonenum": author[4]
                }
                for author in authors
            ]

    def get_all_publishers(self, query):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_ALL_PUBLISHERS.format(
                publisher_table=self.db.publisher_name.value
            ), [
                "%" + query.get("name") + "%"
            ])

            publishers = cursor.fetchall()

            return [
                {
                    "id": publisher[0],
                    "name": publisher[1]
                }
                for publisher in publishers
            ]

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

            self.db.connection.commit()

    def update_publisher(self, publisher):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_UPDATE_PUBLISHER.format(
                publisher_table=self.db.publisher_name.value
            ), (
                publisher.get("name"),
                publisher.get("publisherid")
            ))

            self.db.connection.commit()
