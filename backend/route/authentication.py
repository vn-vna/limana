from flask import Blueprint, request
from flask_cors import cross_origin

from services.authentication_service import AuthenticationService
from models.user import UserModel

auth_blueprint = Blueprint("authentication", __name__)


@cross_origin()
@auth_blueprint.route("/api/auth/signup", methods=["POST"])
def sign_up():
    auth = AuthenticationService()

    email = request.form.get("email")
    password = request.form.get("password")
    firstname = request.form.get("firstname")
    lastname = request.form.get("lastname")
    address = request.form.get("address")
    phonenum = request.form.get("phonenum")
    birthdate = request.form.get("birthdate")

    if not email or not password:
        return {
            "success": False,
            "message": "Email and password are required",
        }, 400

    try:
        auth.create_user({
            "email": email,
            "password": password,
            "firstname": firstname,
            "lastname": lastname,
            "address": address,
            "phonenum": phonenum,
            "userrole": "user"
        })

    except ValueError as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "User created successfully",
    }, 201


@cross_origin()
@auth_blueprint.route("/api/auth/login", methods=["POST"])
def login():
    auth = AuthenticationService()

    email = request.form.get("email")
    password = request.form.get("password")

    if not email or not password:
        return {
            "success": False,
            "message": "Email and password are required",
        }, 400

    sessionid = auth.login(email, password)

    if not sessionid:
        return {
            "success": False,
            "message": "Invalid email or password",
        }, 400

    return {
        "success": True,
        "message": "Login successful",
        "sessionid": sessionid
    }, 200


@cross_origin()
@auth_blueprint.route("/api/auth/check", methods=["GET"])
def check():
    auth = AuthenticationService()

    sessionid = request.headers.get("Limana-SessionID")
    email = request.headers.get("Limana-UserEmail")

    if not sessionid or not email:
        return {
            "success": False,
            "message": "Session ID and email are required",
        }, 400
    
    userid = auth.authorize_session(email, sessionid)

    if not userid:
        return {
            "success": False,
            "message": "Invalid session ID or email",
        }, 401
    
    return {
        "success": True,
        "message": "Session authorized",
        "userid": userid,
    }, 200