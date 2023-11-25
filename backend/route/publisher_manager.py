from flask import Blueprint, request

from services.library_admin_service import LibraryAdminService
from services.authorization_service import AuthorizationService

publisher_mng_blueprint = Blueprint("publisher_manager", __name__)
authorization = AuthorizationService()


@publisher_mng_blueprint.route("/api/publishers", methods=["GET"])
def get_all_publishers():
    libadmin = LibraryAdminService()

    name = request.args.get("name", "")
    address = request.args.get("address", "")
    phonenum = request.args.get("phonenum", "")

    publishers = libadmin.get_all_publishers({
        "name": name,
        "address": address,
        "phonenum": phonenum
    })

    return {
        "success": True,
        "message": "Publishers retrieved successfully",
        "publishers": publishers
    }, 200


@publisher_mng_blueprint.route("/api/publishers", methods=["POST"])
@authorization.guard(role="admin")
def add_publisher():
    libadmin = LibraryAdminService()

    name = request.form.get("name")

    if not name:
        return {
            "success": False,
            "message": "Name is required",
        }, 400

    try:
        libadmin.add_publisher({
            "name": name,
        })

    except Exception as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Publisher added successfully",
    }, 201


@publisher_mng_blueprint.route("/api/publishers/<publisherid>", methods=["PUT"])
@authorization.guard(role="admin")
def update_publisher(publisherid):
    libadmin = LibraryAdminService()

    name = request.form.get("name")

    if not name:
        return {
            "success": False,
            "message": "Name is required",
        }, 400

    try:
        libadmin.update_publisher({
            "publisherid": publisherid,
            "name": name,
        })

    except Exception as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Publisher updated successfully",
    }, 200


@publisher_mng_blueprint.route("/api/publishers/<publisherid>", methods=["DELETE"])
@authorization.guard(role="admin")
def delete_publisher(publisherid):
    libadmin = LibraryAdminService()

    try:
        libadmin.remove_publisher({
            "publisherid": publisherid,
        })

    except Exception as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Publisher deleted successfully",
    }, 200
