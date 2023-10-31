from flask import Blueprint, request

from services.library_admin_service import LibraryAdminService

library_admin_blueprint = Blueprint("library_admin", __name__)


@library_admin_blueprint.route("/api/book/add", methods=["POST"])
def add_book(self, book):
    libad = LibraryAdminService()

    title = request.form.get("title")
    authorid = request.form.get("authorid")
    publisherid = request.form.get("publisherid")
    publish_date = request.form.get("publish_date")
    number_instore = request.form.get("number_instore")
