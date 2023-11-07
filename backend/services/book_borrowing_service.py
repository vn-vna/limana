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

SQL_GET_NOT_RETURNED_USER = """
    SELECT 
        *
    FROM 
        {borrow_table}
    WHERE 
        userid = ?
    AND
        user_return_date IS NULL;
"""

SQL_GET_BORROWED_COPIES = """ 
    SELECT COUNT
        bookid
    FROM 
        {borrow_table}
    WHERE 
        bookid = ?
    AND
        user_return_date IS NULL;
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


class BorrowingService(app_context.AppService):
    def __init__(self):
        super().__init__()
        self.db = SqliteClient()
        self._borrow_time = self._config.get(
            "library::borrow_time", default="10d")

    def start(self):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_CREATE_BORROW_INFO.format(
                borrow_table=self.db.borrowdb_name.value,
            ))
            self.db.connection.commit()

    def stop(self):
        pass
    
    def check_user_return(self, userid:str): #check if user has returned book
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_NOT_RETURNED_USER.format(
                borrow_table=self.db.borrowdb_name.value), 
                (
                userid,
            ))
            self.db.connection.commit()
            if cursor.fetchone(): #if cursor got a data -> true?
                return userid
            if not cursor.fetchone():
                return None
            

    def check_book_availability(self, bookid:str):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_GET_BORROWED_COPIES.format(
                borrow_table=self.db.borrowdb_name.value
                ), (
                    bookid,    
            )) 
            self.db.connection.commit()
            borrowed_copies = cursor.fetchone()  
            return borrowed_copies

    def borrow_book(self, userid:str, bookid:str):
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
            return borrowid
            

    def extends_borrow_time(self, borrowid:str, extend_time, return_date):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(SQL_EXTENDS_BORROW_TIME.format(
                borrow_table=self.db.borrowdb_name.value,
                extend_time=parse_time(extend_time)
            ), (
                borrowid,
                return_date,
            ))
            self.db.connection.commit()
            return return_date
        