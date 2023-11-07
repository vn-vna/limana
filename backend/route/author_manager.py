from flask import Blueprint, request

from services.library_admin_service import LibraryAdminService

author_mng_blueprint = Blueprint("author_mng_blueprint", __name__)


@author_mng_blueprint.route("/api/author/add", methods=["POST"])
def add_author():
    libadmin = LibraryAdminService()

    firstname = request.form.get("firstname")
    lastname = request.form.get("lastname")
    address = request.form.get("address")
    phonenum = request.form.get("phonenum")

    dict_author = {
        "firstname": firstname,
        "lastname": lastname,
        "address": address,
        "phonenum": phonenum
    }

    if not firstname or not lastname:
        return {
            "success": False,
            "message": "Firstname and lastname are required",
        }, 400

    try:
        add_author = libadmin.add_author(dict_author)
        return {
            "success": True,
            "message": "Author added successfully",
        }, 201

    except ValueError as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400


@author_mng_blueprint.route("/api/author/<author_id>", methods=["GET"])
def get_author(author_id):
    libadmin = LibraryAdminService()

    author = libadmin.get_author(author_id)

    return {
        "success": True,
        "data": author
    }, 200


@author_mng_blueprint.route("/api/author", methods=["GET"])
def get_all_authors():
    libadmin = LibraryAdminService()

    all_authors = libadmin.get_all_authors()

    return {
        "success": True,
        "data": all_authors
    }, 200


@author_mng_blueprint.route("/api/author/<author_id>", methods=["DELETE"])
def remove_author(author_id):
    libadmin = LibraryAdminService()

    remove_author = libadmin.remove_author(author_id)

    return {
        "success": True,
        "message": "Author removed successfully",
    }, 200


@author_mng_blueprint.route("/api/author/<author_id>", methods=["PUT"])
def update_author(author_id):
    libadmin = LibraryAdminService()

    author_id = request.form.get("authorid")

    update_author = libadmin.update_author(author_id)

    return {
        "success": True,
        "message": "Author updated successfully",
    }, 200
