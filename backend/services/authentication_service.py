import uuid
import contextlib
import hashlib
import pytimeparse
import threading
import time

from context import app_context
from clients.sqlite_client import SqliteClient
from models.user import UserModel

SQL_CREATE_AUTH_TABLE = """
    CREATE TABLE IF NOT EXISTS {auth_table} (
        userid      CHAR(30)        PRIMARY KEY,
        email       CHAR(60)        UNIQUE NOT NULL, 
        hashed_pwd  CHAR(50)        NOT NULL,
        firstname   NVARCHAR(50),
        lastname    NVARCHAR(50),
        address     NVARCHAR(255),
        phonenum    CHAR(12),
        birthdate   DATE,
        userrole    CHAR(5)
    );
"""

SQL_CREATE_SESSION_TABLE = """
    CREATE TABLE IF NOT EXISTS {session_table} (
        sessionid   CHAR(30)        PRIMARY KEY,
        userid      CHAR(30)        NOT NULL,
        created     DATETIME        NOT NULL,
        expiration  DATETIME        NOT NULL,
        FOREIGN KEY (userid) REFERENCES {auth_table}(userid)
    );
"""

SQL_INSERT_NEW_USER = """
    INSERT INTO 
        {auth_table} (
            userid, 
            email, 
            hashed_pwd, 
            firstname, 
            lastname, 
            address, 
            phonenum, 
            birthdate,
            userrole
        ) 
    VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?);
"""

SQL_INSERT_NEW_SESSION = """
    INSERT INTO 
        {session_table} (
            sessionid, 
            userid, 
            created, 
            expiration
        ) 
    VALUES 
        (?, ?, DATETIME('now'), DATETIME('now', '+{token_alive} seconds'));
"""

SQL_GET_USER = """
    SELECT 
        * 
    FROM 
        {auth_table} 
    WHERE 
        email = ?;
"""

SQL_GET_USER_HASHED_PASSWORD = """
    SELECT
        userid,
        hashed_pwd
    FROM
        {auth_table}
    WHERE
        email = ?;
"""

SQL_GET_USERID_BY_SESSION = """
    SELECT 
        {session_table}.userid,
        {session_table}.sessionid
    FROM 
        {auth_table}
    LEFT OUTER JOIN
        {session_table}
    ON 
        {auth_table}.userid = {session_table}.userid
    WHERE
        {session_table}.sessionid = ? AND {auth_table}.email = ?;
"""

SQL_CLEANUP_SESSION = """
    DELETE FROM 
        {session_table} 
    WHERE 
        expiration < DATETIME('now');
"""


class AuthenticationService(app_context.AppService):
    def __init__(self):
        super().__init__()

        self._cleanup_interval = self._config.get(
            "authentication::cleanup_interval",
            default="1h")

        self._token_alive = self._config.get(
            "authentication::token_alive",
            default="3d")

        self._cleanup_thread = threading.Thread(
            target=self._cleanup_sessions,
            daemon=True
        )

        self.db = SqliteClient()

    def start(self):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(
                SQL_CREATE_AUTH_TABLE.format(
                    auth_table=self.db.authdb_name.value
                ),
            )
            cursor.execute(
                SQL_CREATE_SESSION_TABLE.format(
                    session_table=self.db.sessiondb_name.value,
                    auth_table=self.db.authdb_name.value),
            )
            self.db.connection.commit()

        self._cleanup_thread.start()

    def stop(self):
        pass

    def create_user(self, user_data: dict):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(
                SQL_GET_USER.format(auth_table=self.db.authdb_name.value),
                [
                    user_data["email"],
                ]
            )

            if cursor.fetchone():
                raise ValueError("User already exists")

            userid = uuid.uuid4().hex
            hashed_password = self._hash_password(
                user_data["email"], user_data["password"])

            cursor.execute(
                SQL_INSERT_NEW_USER.format(
                    auth_table=self.db.authdb_name.value),
                [
                    userid,
                    user_data["email"],
                    hashed_password,
                    user_data["firstname"],
                    user_data["lastname"],
                    user_data["address"],
                    user_data["phonenum"],
                    user_data["birthdate"],
                    user_data["userrole"]
                ]
            )
            self.db.connection.commit()

    def login(self, email: str, password: str):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(
                SQL_GET_USER_HASHED_PASSWORD.format(
                    auth_table=self.db.authdb_name.value),
                [email])

            data = cursor.fetchone()

            if not data:
                return None

            userid, user_password = data

            hashed_password = self._hash_password(email, password)

            if hashed_password != user_password:
                return None

            sessionid = uuid.uuid4().hex
            cursor.execute(
                SQL_INSERT_NEW_SESSION.format(
                    session_table=self.db.sessiondb_name.value,
                    token_alive=pytimeparse.parse(self._token_alive.value)),
                [sessionid, userid]
            )

            self.db.connection.commit()

            return sessionid

    def authorize_session(self, email: str, sessionid: str):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(
                SQL_GET_USERID_BY_SESSION.format(
                    session_table=self.db.sessiondb_name.value,
                    auth_table=self.db.authdb_name.value),
                [sessionid, email]
            )

            data = cursor.fetchone()

            if not data:
                return None

            userid, sessionid = data

            return userid

    def _hash_password(self, useremail: str, password: str):
        return hashlib.sha256(f"{useremail}:{password}".encode("utf-8")).hexdigest()

    def _cleanup_sessions(self):
        while True:
            with contextlib.closing(self.db.get_cursor()) as cursor:
                cursor.execute(
                    SQL_CLEANUP_SESSION.format(
                        session_table=self.db.sessiondb_name.value)
                )
                self.db.connection.commit()

            time.sleep(pytimeparse.parse(self._cleanup_interval.value))
