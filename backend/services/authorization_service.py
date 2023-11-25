import contextlib
import functools
from flask import request

from context import app_context
from clients.sqlite_client import SqliteClient

SQL_AUTHORIZE_SESSION = """
    SELECT
        {session_table}.userid,
        {session_table}.sessionid,
        {auth_table}.userrole
    FROM
        {auth_table}
    LEFT OUTER JOIN
        {session_table}
    ON
        {auth_table}.userid = {session_table}.userid
    WHERE
        {session_table}.sessionid = ? AND {auth_table}.email = ?;
"""


class AuthorizationService(app_context.AppService):
    def __init__(self):
        super().__init__()

        self.db = SqliteClient()

    def start(self):
        pass

    def stop(self):
        pass

    def get_token(self):
        email = request.headers.get("Limana-UserEmail", None)
        sessionid = request.headers.get("Limana-SessionID", None)

        if not email or not sessionid:
            raise RuntimeError("Email and session ID are required")

        return sessionid, email

    def guard(self, role=None):

        def role_guard(func):

            @functools.wraps(func)
            def wrapper_guard(*args, **kwargs):
                with contextlib.closing(self.db.get_cursor()) as cursor:
                    cursor.execute(SQL_AUTHORIZE_SESSION.format(
                        session_table=self.db.sessiondb_name.value,
                        auth_table=self.db.authdb_name.value
                    ), self.get_token())

                    result = cursor.fetchone()

                    if not result:
                        return {
                            "success": False,
                            "message": "Invalid session ID or email",
                        }, 401

                    if role and result[2] != role:
                        return {
                            "success": False,
                            "message": "Invalid user role",
                        }, 403

                    wrapper_guard.auth = {
                        "userid": result[0],
                        "sessionid": result[1],
                        "userrole": result[2]
                    }
                    return func(*args, **kwargs)

            return wrapper_guard

        return role_guard
