from flask import Blueprint, request

from services.authentication_service import AuthenticationService
from services.useradata_service import UserDataService

userdata_blueprint = Blueprint("userdata", __name__)


@userdata_blueprint.route("/api/userdata", methods=["GET"])
def get_userdata():

    auth = AuthenticationService()
    udata = UserDataService()

    email = request.headers.get("Limana-UserEmail")
    sessionid = request.headers.get("Limana-SessionID")

    uid = auth.authorize_session(email, sessionid)

    if not uid:
        return {
            "success": False,
            "message": "Invalid session ID or email",
        }, 401

    userdata = udata.get_userdata(uid)

    if not userdata:
        return {
            "success": False,
            "message": "User not found",
        }, 404

    return {
        "success": True,
        "message": "User data retrieved successfully",
        "userdata": userdata
    }, 200


@userdata_blueprint.route("/api/userdata", methods=["PUT"])
def update_userdata():

    auth = AuthenticationService()
    udata = UserDataService()

    email = request.headers.get("Limana-UserEmail")
    sessionid = request.headers.get("Limana-SessionID")

    uid = auth.authorize_session(email, sessionid)

    if not uid:
        return {
            "success": False,
            "message": "Invalid session ID or email",
        }, 401

    update_status = udata.update_userdata(uid, {
        "firstname": request.form.get("firstname"),
        "lastname": request.form.get("lastname"),
        "address": request.form.get("address"),
        "phonenum": request.form.get("phonenum"),
        "birthdate": request.form.get("birthdate"),
    })

    if not update_status:
        return {
            "success": False,
            "message": "User not found",
        }, 404

    return {
        "success": True,
        "message": "User data updated successfully",
    }, 200
