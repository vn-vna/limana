from flask import Blueprint, request

from services.library_admin_service import LibraryAdminService

publisher_manager_blueprint = Blueprint("publisher_manager", __name__)


@publisher_manager_blueprint.route("/api/publisher", methods=["POST"])
def add_publisher():
    libad = LibraryAdminService()

    publisher_name = request.form.get("name")

    try:
        libad.add_publisher({
            "name": publisher_name
        })

        return {
            "status": "success",
            "message": "Publisher added successfully."
        }, 200

    except ValueError as e:
        return {
            "status": "failed",
            "message": str(e)
        }, 400


@publisher_manager_blueprint.route("/api/publisher", methods=["GET"])
def get_all_publishers():
    libad = LibraryAdminService()

    publishers = libad.get_all_publishers()

    return {
        "status": "success",
        "data": publishers
    }, 200


@publisher_manager_blueprint.route("/api/publisher/<publisher_id>", methods=["GET"])
def get_publisher(publisher_id):
    libad = LibraryAdminService()

    publisher = libad.get_publisher(publisher_id)

    return {
        "status": "success",
        "data": publisher
    }, 200


@publisher_manager_blueprint.route("/api/publisher/<publisher_id>", methods=["PUT"])
def update_publisher(publisher_id):
    libad = LibraryAdminService()

    publisher_name = request.form.get("publisher_name")

    try:
        libad.update_publisher(publisher_id, {
            "publisher_name": publisher_name
        })

        return {
            "status": "success",
            "message": "Publisher updated successfully."
        }, 200

    except ValueError as e:
        return {
            "status": "failed",
            "message": str(e)
        }, 400
