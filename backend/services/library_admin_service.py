import contextlib

from context import app_context
from clients.sqlite_client import SqliteClient
import uuid

SQL_CREATE_BOOK_TABLE = """ 
    CREATE TABLE IF NOT EXISTS {book_table} (
        bookid              CHAR(30)        PRIMARY KEY,
        title               NVARCHAR(50)    NOT NULL,
        authorid            NVARCHAR(50)    NOT NULL,
        publisherid         NVARCHAR(50)    NOT NULL,
        publish_date        DATETIME        NOT NULL,
        number_instore      INT             NOT NULL,
        FOREIGN KEY (authorid) REFERENCES {author_table} (authorid),
        FOREIGN KEY (publisherid) REFERENCES {publisher_table} (publisherid)
    );
"""

# Nice
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

SQL_SEARCH_BOOK = """
    SELECT * FROM {book_table} WHERE title LIKE ?;
"""

SQL_SEARCH_BOOK_AUTHOR = """
    SELECT * FROM {book_table} WHERE authorid LIKE ?;
"""

SQL_SEARCH_BOOK_PUBLISHER = """
    SELECT * FROM {book_table} WHERE publisherid LIKE ?;
"""

SQL_SEARCH_ALL_BOOKS = """
    SELECT * FROM {book_table};
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

SQL_GET_AUTHOR = """
    SELECT * FROM {author_table} WHERE authorid = ?;
"""

SQL_GET_ALL_AUTHORS = """
    SELECT * FROM {author_table};
"""


SQL_CREATE_NEW_PUBLISHER = """
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

SQL_GET_PUBLISHER = """
    SELECT * FROM {publisher_table} WHERE publisherid = ?;
"""

SQL_GET_ALL_PUBLISHERS = """
    SELECT * FROM {publisher_table};
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
                book_table=self.db.bookdb_name.value,
                author_table=self.db.authordb_name.value,
                publisher_table=self.db.publisher_name.value
            ))

            cursor.execute(SQL_CREATE_NEW_PUBLISHER.format(
                publisher_table=self.db.publisher_name.value
            ))

            self.db.connection.commit()

    def stop(self):
        pass

    def add_book(self, book):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            if book.get("title") is None:
                raise ValueError("Book title cannot be emtpy")

            bookid = uuid.uuid4().hex
            cursor.execute(SQL_INSERT_NEW_BOOK.format(
                book_table=self.db.bookdb_name.value,
            ), (
                bookid,
                book.get("title"),
                book.get("authorid"),
                book.get("publisherid"),
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

    def get_book(self, bookid):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_SEARCH_BOOK.format(
                book_table=self.db.bookdb_name.value
            ), (
                bookid,
            ))

            data = cursor.fetchone()

            if data is None:
                return None

            response = {
                "bookid": data[0],
                "title": data[1],
                "authorid": data[2],
                "publisherid": data[3],
                "publish_date": data[4],
                "number_instore": data[5]
            }

            return response

    def get_all_books(self):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_SEARCH_ALL_BOOKS.format(
                book_table=self.db.bookdb_name.value
            ))

            data = cursor.fetchall()
            response = []

            for row in data:
                response.append({
                    "bookid": row[0],
                    "title": row[1],
                    "authorid": row[2],
                    "publisherid": row[3],
                    "publish_date": row[4],
                    "number_instore": row[5]
                })

            return response

    def search_book_by_title(self, book):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_SEARCH_BOOK.format(
                book_table=self.db.bookdb_name.value
            ), (
                book.get("title"),
            ))

            data = cursor.fetchall()

            response = [
                {
                    "bookid": row[0],
                    "title": row[1],
                    "authorid": row[2],
                    "publisherid": row[3],
                    "publish_date": row[4],
                    "number_instore": row[5]
                } for row in data
            ]

            return response

    def search_book_by_author(self, book):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_SEARCH_BOOK_AUTHOR.format(
                book_table=self.db.bookdb_name.value
            ), (
                book.get("authorid"),
            ))

            data = cursor.fetchall()

            response = [
                {
                    "bookid": row[0],
                    "title": row[1],
                    "authorid": row[2],
                    "publisherid": row[3],
                    "publish_date": row[4],
                    "number_instore": row[5]
                } for row in data
            ]

            return response

    def search_book_by_publisher(self, book):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_SEARCH_BOOK_PUBLISHER.format(
                book_table=self.db.bookdb_name.value
            ), (
                book.get("publisherid"),
            ))

            data = cursor.fetchall()

            response = [
                {
                    "bookid": row[0],
                    "title": row[1],
                    "authorid": row[2],
                    "publisherid": row[3],
                    "publish_date": row[4],
                    "number_instore": row[5]
                } for row in data
            ]

            return response

    def add_author(self, author: dict):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            if author.get("firstname") is None:
                raise ValueError("Author's firstname cannot be empty")

            if author.get("lastname") is None:
                raise ValueError("Author's lastname cannot be empty")

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

    def get_author(self, authorid):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_AUTHOR.format(
                author_table=self.db.authordb_name.value
            ), (
                authorid,
            ))

    def get_all_authors(self):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_ALL_AUTHORS.format(
                author_table=self.db.authordb_name.value
            ))

            data = cursor.fetchall()

            respone = []

            for row in data:
                respone.append({
                    "authorid": row[0],
                    "firstname": row[1],
                    "lastname": row[2],
                    "address": row[3],
                    "phonenum": row[4]
                })

            return respone

    def add_publisher(self, publisher):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            if publisher.get("name") is None:
                raise ValueError("Publisher's name cannot be empty")

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

    def get_publisher(self, publisherid):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_PUBLISHER.format(
                publisher_table=self.db.publisher_name.value
            ), (
                publisherid,
            ))

    def get_all_publishers(self):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_ALL_PUBLISHERS.format(
                publisher_table=self.db.publisher_name.value
            ))

            data = cursor.fetchall()
            response = []

            for row in data:
                response.append({
                    "publisherid": row[0],
                    "name": row[1]
                })

            return response
