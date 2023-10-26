from flask import Blueprint, request
from flask_cors import cross_origin

from services.authentication_service import AuthenticationService
from models.user import UserModel

auth_blueprint = Blueprint("authentication", __name__)


@cross_origin()
@auth_blueprint.route("/api/auth/signup", methods=["POST"])
def sign_up():
    auth = AuthenticationService()

    username = request.form.get("username")
    password = request.form.get("password")
    firstname = request.form.get("firstname")
    lastname = request.form.get("lastname")
    address = request.form.get("address")
    phonenum = request.form.get("phonenum")
    userrole = request.form.get("userrole")

    if not username or not password:
        return {
            "success": False,
            "message": "Username and password are required",
        }, 400

    try:
        auth.create_user({
            "username": username,
            "password": password,
            "firstname": firstname,
            "lastname": lastname,
            "address": address,
            "phonenum": phonenum,
            "userrole": userrole
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

    username = request.form.get("username")
    password = request.form.get("password")

    if not username or not password:
        return {
            "success": False,
            "message": "Username and password are required",
        }, 400

    sessionid = auth.login(username, password)

    if not sessionid:
        return {
            "success": False,
            "message": "Invalid username or password",
        }, 401

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
    username = request.headers.get("Limana-Username")

    if not sessionid or not username:
        return {
            "success": False,
            "message": "Session ID and username are required",
        }, 400
    
    userid = auth.authorize_session(username, sessionid)

    if not userid:
        return {
            "success": False,
            "message": "Invalid session ID or username",
        }, 401
    
    return {
        "success": True,
        "message": "Session authorized",
        "userid": userid,
        "form_data": request.form
    }, 200