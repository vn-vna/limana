import uuid
import contextlib
from clients.sqlite_client import SqliteClient
from pytimeparse import parse as parse_time

from context import app_context

SQL_CREATE_BORROWMAPPING_TABLE = """
CREATE TABLE IF NOT EXISTS {borrow_table} (
    id                  CHAR(30) PRIMARY KEY,
    userid              CHAR(30) NOT NULL,
    bookid              CHAR(30) NOT NULL,
    borrow_date         DATETIME NOT NULL,
    return_date         DATETIME NOT NULL,
    user_return_date    DATETIME,
    status              CHAR(30) NOT NULL
);
"""

SQL_GET_BORROW_LIST = """
SELECT
    {borrow_table}.id,
    {borrow_table}.bookid,
    {borrow_table}.borrow_date,
    {borrow_table}.return_date,
    {borrow_table}.user_return_date,
    {borrow_table}.status,
    {book_table}.title,
    {book_table}.number_instore,
    {auth_table}.email
FROM
    {borrow_table}
INNER JOIN
    {book_table}
ON
    {borrow_table}.bookid = {book_table}.bookid
INNER JOIN
    {auth_table}
ON
    {borrow_table}.userid = {auth_table}.userid
"""

SQL_GET_USER_BORROW_LIST = """
SELECT
    {borrow_table}.id,
    {borrow_table}.bookid,
    {borrow_table}.borrow_date,
    {borrow_table}.return_date,
    {borrow_table}.user_return_date,
    {borrow_table}.status,
    {book_table}.title,
    {book_table}.number_instore,
    {auth_table}.email
FROM
    {borrow_table}
INNER JOIN
    {book_table}
ON
    {borrow_table}.bookid = {book_table}.bookid
INNER JOIN
    {auth_table}
ON
    {borrow_table}.userid = {auth_table}.userid
WHERE
    {borrow_table}.userid = ?
"""

SQL_GET_INSTORE_COUNT = """
SELECT
    number_instore
FROM
    {book_table}
WHERE
    bookid = ?
"""

SQL_GET_OCCUPIED_COUNT = """
SELECT
    COUNT(*)
FROM
    {borrow_table}
WHERE
    {borrow_table}.bookid = ? AND 
    {borrow_table}.status = 'ACCEPTED'
"""

SQL_REQUEST_BORROW = """
INSERT INTO {borrow_table} 
    (id, userid, bookid, borrow_date, return_date, status) 
VALUES 
    (?, ?, ?, DATETIME('now'), DATETIME('now', '+{borrow_time} seconds'), 'PENDING')
"""

SQL_ACCEPT_BORROW = """
UPDATE {borrow_table}
SET 
    status = 'ACCEPTED'
WHERE id = ?
"""

SQL_REJECT_BORROW = """
UPDATE {borrow_table}
SET 
    status = 'REJECTED'
WHERE id = ?
"""

SQL_RETURN_BORROW = """
UPDATE {borrow_table}
SET 
    status = 'RETURNED',
    user_return_date = DATETIME('now')
WHERE 
    id = ? AND userid = ?
"""

SQL_GET_BORROW_BOOKID = """
SELECT
    bookid
FROM
    {borrow_table}
WHERE
    id = ?
"""

class BookBorrowingService(app_context.AppService):
    def __init__(self):
        super().__init__()
        self.db = SqliteClient()
        self._borrow_time = self._config.get("library::borrow_time", default="7d")

    def start(self):
        with contextlib.closing(self.db.get_cursor()) as cur:
            cur.execute(SQL_CREATE_BORROWMAPPING_TABLE.format(
                borrow_table=self.db.borrowdb_name.value))

            self.db.connection.commit()

    def stop(self):
        pass

    def get_all_borrowing(self):
        with contextlib.closing(self.db.get_cursor()) as cur:
            cur.execute(SQL_GET_BORROW_LIST.format(
                borrow_table=self.db.borrowdb_name.value,
                book_table=self.db.bookdb_name.value,
                auth_table=self.db.authdb_name.value
            ))

            borrowings = cur.fetchall()

        return [
            {
                "id": borrowing[0],
                "bookid": borrowing[1],
                "borrow_date": borrowing[2],
                "return_date": borrowing[3],
                "user_return_date": borrowing[4],
                "status": borrowing[5],
                "book_title": borrowing[6],
                "book_instore": borrowing[7],
                "user_email": borrowing[8]
            } for borrowing in borrowings
        ]

    def request_borrow(self, user_id: str, book_id: str):
        borrow_id = str(uuid.uuid4())
        with contextlib.closing(self.db.get_cursor()) as cur:
            if self.get_remaining_instore(book_id) == 0:
                raise ValueError("No more books in store")

            cur.execute(
                SQL_REQUEST_BORROW.format(
                    borrow_table=self.db.borrowdb_name.value,
                    borrow_time=parse_time(self._borrow_time.value)
                ),
                (borrow_id, user_id, book_id)
            )
            self.db.connection.commit()

        return borrow_id
    
    def get_borrow_bookid(self, borrow_id: str):
        with contextlib.closing(self.db.get_cursor()) as cur:
            cur.execute(
                SQL_GET_BORROW_BOOKID.format(
                    borrow_table=self.db.borrowdb_name.value
                ),
                (borrow_id,)
            )

            book_id = cur.fetchone()[0]

        return book_id

    def accept_borrow(self, borrow_id: str):
        with contextlib.closing(self.db.get_cursor()) as cur:
            book_id = self.get_borrow_bookid(borrow_id)
            
            if self.get_remaining_instore(book_id) == 0:
                raise ValueError("No more books in store")

            cur.execute(
                SQL_ACCEPT_BORROW.format(
                    borrow_table=self.db.borrowdb_name.value
                ),
                (borrow_id,)
            )

            self.db.connection.commit()


    def reject_borrow(self, borrow_id: str):
        with contextlib.closing(self.db.connect()) as conn:
            conn.execute(
                f"UPDATE {
                    self.db.borrowdb_name.value} SET status = 'REJECTED' WHERE id = ?",
                (borrow_id,)
            )
            self.db.connection.commit()

    def return_borrow(self, uid, borrow_id):
        with contextlib.closing(self.db.get_cursor()) as cur:
            cur.execute(
                SQL_RETURN_BORROW.format(
                    borrow_table=self.db.borrowdb_name.value
                ),
                (borrow_id, uid)
            )

            affected = cur.rowcount
            
            if affected == 0:
                raise ValueError("Borrow ID not found")
            
            self.db.connection.commit()

    def get_remaining_instore(self, book_id: str):
        with contextlib.closing(self.db.get_cursor()) as cur:
            cur.execute(
                SQL_GET_INSTORE_COUNT.format(
                    book_table=self.db.bookdb_name.value
                ), (book_id,)
            )

            instore = cur.fetchone()[0]

            cur.execute(
                SQL_GET_OCCUPIED_COUNT.format(
                    borrow_table=self.db.borrowdb_name.value,
                ),
                (book_id,)
            )

            occupied = cur.fetchone()[0]

            return instore - occupied

    def get_user_borrowing(self, user_id: str):
        with contextlib.closing(self.db.get_cursor()) as cur:
            cur.execute(
                SQL_GET_USER_BORROW_LIST.format(
                    borrow_table=self.db.borrowdb_name.value,
                    book_table=self.db.bookdb_name.value,
                    auth_table=self.db.authdb_name.value
                ),
                (user_id,)
            )

            borrowings = cur.fetchall()

        return [
            {
                "id": borrowing[0],
                "bookid": borrowing[1],
                "borrow_date": borrowing[2],
                "return_date": borrowing[3],
                "user_return_date": borrowing[4],
                "status": borrowing[5],
                "book_title": borrowing[6],
                "book_instore": borrowing[7],
                "user_email": borrowing[8]
            } for borrowing in borrowings
        ]