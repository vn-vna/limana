import contextlib

from context import app_context
from clients.sqlite_client import SqliteClient

SQL_GET_USER_DATA = """
    SELECT 
        email,
        firstname,
        lastname,
        address,
        phonenum,
        birthdate,
        userrole
    FROM 
        {auth_table} 
    WHERE 
        userid = ?;
"""

SQL_UPDATE_USER_DATA = """
    UPDATE
        {auth_table}
    SET
        firstname = ?,
        lastname = ?,
        address = ?,
        phonenum = ?,
        birthdate = ?
    WHERE
        userid = ?;
"""

SQL_GET_ALL_USER_DATA = """
    SELECT
        userid,
        email,
        firstname,
        lastname,
        userrole
    FROM
        {auth_table}
"""


class UserDataService(app_context.AppService):
    def __init__(self):
        super().__init__()

        self.db = SqliteClient()

    def start(self):
        pass

    def stop(self):
        pass

    def get_userdata(self, uid):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(
                SQL_GET_USER_DATA.format(
                    auth_table=self.db.authdb_name.value),
                [
                    uid
                ]
            )

            result = cursor.fetchone()

            if not result:
                return None

            return {
                "email": result[0],
                "firstname": result[1],
                "lastname": result[2],
                "address": result[3],
                "phonenum": result[4],
                "birthdate": result[5],
                "userrole": result[6]
            }

    def update_userdata(self, uid, userdata):
        print(userdata)

        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(
                SQL_UPDATE_USER_DATA.format(
                    auth_table=self.db.authdb_name.value),
                [
                    userdata["firstname"],
                    userdata["lastname"],
                    userdata["address"],
                    userdata["phonenum"],
                    userdata["birthdate"],
                    uid
                ]
            )

            self.db.connection.commit()

            if cursor.rowcount == 0:
                return False

            return True

    def get_all_users(self):
        with contextlib.closing(self.db.get_cursor()) as cursor:
            cursor.execute(
                SQL_GET_ALL_USER_DATA.format(auth_table=self.db.authdb_name.value)
            )

            result = cursor.fetchall()

            if not result:
                return None

            return [
                {
                    "userid": row[0],
                    "email": row[1],
                    "firstname": row[2],
                    "lastname": row[3],
                    "userrole": row[4]
                } for row in result
            ]
