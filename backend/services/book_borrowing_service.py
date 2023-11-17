from context import app_context
import contextlib
from clients.sqlite_client import SqliteClient
import uuid
from pytimeparse import parse as parse_time

SQL_CREATE_BORROW_INFO = """
    CREATE TABLE IF NOT EXISTS {borrow_table} (
        borrowid    CHAR(30)        PRIMARY KEY,
        userid      CHAR(30)        NOT NULL,
        bookid      CHAR(30)        NOT NULL,
        borrow_date DATETIME        NOT NULL,
        return_date DATETIME        NOT NULL,
        user_return_date    DATETIME NULL,
        FOREIGN KEY (userid) REFERENCES {auth_table}(userid),
        FOREIGN KEY (bookid) REFERENCES {book_table}(bookid)
    );
"""

SQL_INSERT_NEW_BORROW_INFO = """
    INSERT INTO 
        {borrow_table} (
            borrowid,
            userid,
            bookid,
            borrow_date,
            return_date,
            user_return_date 
        )
    VALUES
        (?, ?, ?, DATETIME('now'), DATETIME('now', '+{borrow_time} seconds'), NULL);
"""

SQL_EXTENDS_BORROW_TIME = """
    UPDATE {borrow_table} SET
        return_date = DATETIME(return_date, '+{extend_time} seconds')
    WHERE
        borrowid = ?;
"""


class BookBorrowingService(app_context.AppService):
    def __init__(self):
        super().__init__()
        self.db = SqliteClient()
        self._borrow_time = self._config.get(
            "library::borrow_time", default="10d")

    def start(self):
        with contextlib.closing(self.db.get_connection()) as cursor:
            cursor.execute(SQL_CREATE_BORROW_INFO.format(
                borrow_table=self.db.borrowdb_name.value,
            ))
            self.db.connection.commit()

    def stop(self):
        pass

    def borrow_book(self, userid, bookid):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            borrowid = uuid.uuid4().hex
            cursor.execute(SQL_INSERT_NEW_BORROW_INFO.format(
                borrow_table=self.db.borrowdb_name.value,
                borrow_time=parse_time(self._borrow_time.value)
            ), (
                borrowid,
                userid,
                bookid,
            ))
            self.db.connection.commit()

    def extends_borrow_time(self, borrowid, extend_time):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_EXTENDS_BORROW_TIME.format(
                borrow_table=self.db.borrowdb_name.value,
                extend_time=parse_time(extend_time)
            ), (
                borrowid,
            ))
            self.db.connection.commit()
