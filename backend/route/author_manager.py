from flask import Blueprint, request

from services.library_admin_service import LibraryAdminService
from services.authorization_service import AuthorizationService

author_mng_blueprint = Blueprint("author_manager", __name__)
authorize = AuthorizationService()


@author_mng_blueprint.route("/api/authors", methods=["POST"])
@authorize.guard(role="admin")
def add_author():
    libadmin = LibraryAdminService()

    firstname = request.form.get("firstname")
    lastname = request.form.get("lastname")
    address = request.form.get("address")
    phonenum = request.form.get("phonenum")

    if not firstname or not lastname:
        return {
            "success": False,
            "message": "Firstname and lastname are required",
        }, 400

    try:
        libadmin.add_author({
            "firstname": firstname,
            "lastname": lastname,
            "address": address,
            "phonenum": phonenum
        })

    except ValueError as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Author added successfully",
    }, 201


@author_mng_blueprint.route("/api/authors", methods=["GET"])
def get_all_authors():
    libadmin = LibraryAdminService()

    authorname = request.args.get("name", "")
    address = request.args.get("address", "")
    phonenum = request.args.get("phonenum", "")

    authors = libadmin.get_all_authors({
        "authorname": authorname, 
        "address": address,
        "phonenum": phonenum
    })

    return {
        "success": True,
        "message": "Authors retrieved successfully",
        "authors": authors
    }, 200


@author_mng_blueprint.route("/api/authors/<authorid>", methods=["PUT"])
@authorize.guard(role="admin")
def update_author(authorid):
    libadmin = LibraryAdminService()

    firstname = request.form.get("firstname")
    lastname = request.form.get("lastname")
    address = request.form.get("address")
    phonenum = request.form.get("phonenum")

    if not firstname or not lastname:
        return {
            "success": False,
            "message": "Firstname and lastname are required",
        }, 400

    try:
        libadmin.update_author({
            "authorid": authorid,
            "firstname": firstname,
            "lastname": lastname,
            "address": address,
            "phonenum": phonenum
        })

    except ValueError as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Author updated successfully",
    }, 200


@author_mng_blueprint.route("/api/authors/<authorid>", methods=["DELETE"])
@authorize.guard(role="admin")
def remove_author(authorid):
    libadmin = LibraryAdminService()
    if not authorid:
        return {
            "success": False,
            "message": "Author ID is required",
        }, 400

    libadmin.remove_author({
        "authorid": authorid
    })

    return {
        "success": True,
        "message": "Author removed successfully",
    }, 200
