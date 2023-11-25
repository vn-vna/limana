from flask import Blueprint, request

from services.authentication_service import AuthenticationService
from services.useradata_service import UserDataService
from services.authorization_service import AuthorizationService

userdata_blueprint = Blueprint("userdata", __name__)

authorize = AuthorizationService()


@userdata_blueprint.route("/api/userdata/all")
@authorize.guard(role="admin")
def get_all_users():
    udata = UserDataService()

    users = udata.get_all_users()

    return {
        "success": True,
        "message": "Users retrieved successfully",
        "users": users
    }, 200


@userdata_blueprint.route("/api/userdata", methods=["GET"])
@authorize.guard()
def get_userdata():
    udata = UserDataService()

    try:
        uid = get_userdata.auth.get("userid")
    except AttributeError:
        uid = None

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
@authorize.guard()
def update_userdata():
    udata = UserDataService()

    try:
        uid = update_userdata.auth.get("userid")
    except AttributeError:
        uid = None

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
