from context import app_context
import contextlib
from clients.sqlite_client import SqliteClient

SQL_CREATE_BORROW_INFO = """
    CREATE TABLE IF NOT EXISTS {borrow_table} (
        borrowid    CHAR(30)        PRIMARY KEY,
        userid      CHAR(30)        NOT NULL,
        bookid      CHAR(30)        NOT NULL,
        borrow_date DATETIME        NOT NULL,
        return_date DATETIME        NOT NULL,
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
            return_date
        )
    VALUES
        (?, ?, ?, ?, ?);
"""

SQL_DELETE_BORROW_INFO = """
    DELETE FROM {borrow_table} WHERE borrowid = ?;
"""
SQL_UPDATE_BORROW_INFO = """
    UPDATE {borrow_table} SET
        userid = ?,
        bookid = ?,
        borrow_date = ?,
        return_date = ?
    WHERE
        borrowid = ?;
"""


class BookBorrowingService(app_context.AppService):
    def __init__(self):
        super().__init__()
        self.db = SqliteClient()

    def start(self):
        with contextlib.closing(self.db.get_connection()) as cursor:
            cursor.execute(SQL_CREATE_BORROW_INFO.format(
                borrow_table=self.db.borrowdb_name.value,
            ))
            self.db.connection.commit()

    def stop(self):
        pass

    def borrow_book(self, borrow_info):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_INSERT_NEW_BORROW_INFO.format(
                borrow_table=self.db.borrowdb_name.value
            ), (
                borrow_info.get("borrowid"),
                borrow_info.get("userid"),
                borrow_info.get("bookid"),
                borrow_info.get("borrow_date"),
                borrow_info.get("return_date")
            ))
            self.db.connection.commit()

    def delete_borrow(self, borrow_info):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_DELETE_BORROW_INFO.format(
                borrow_table=self.db.borrowdb_name.value
            ), (borrow_info.get("borrowid"),))

    def update_borrow(self, borrow_info):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_UPDATE_BORROW_INFO.format(
                borrow_table=self.db.borrowdb_name.value
            ), (borrow_info.get("borrowid")))
