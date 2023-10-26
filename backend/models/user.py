from dataclasses import dataclass

@dataclass
class UserModel:
    userid: str
    username: str
    hashed_pwd: str
    firstname: str
    lastname: str
    address: str
    phonenum: str
    userrole: str
