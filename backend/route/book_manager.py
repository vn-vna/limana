from flask import Blueprint, request

from services.library_admin_service import LibraryAdminService

book_manager_blueprint = Blueprint("library_admin", __name__)


@book_manager_blueprint.route("/api/book/add", methods=["POST"])
def add_book():
    libad = LibraryAdminService()

    title = request.form.get("title")
    authorid = request.form.get("authorid")
    publisherid = request.form.get("publisherid")
    publish_date = request.form.get("publish_date")
    number_instore = request.form.get("number_instore")

    dict_book = {
        "title": title,
        "authorid": authorid,
        "publisherid": publisherid,
        "publish_date": publish_date,
        "number_instore": number_instore
    }

    try:
        add_book = libad.add_book(dict_book)

        return {
            "success": True,
            "message": "Book added successfully",
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e),
        }, 400


@book_manager_blueprint.route("/api/book/<book_id>", methods=["GET"])
def get_book(book_id):
    libad = LibraryAdminService()

    book = libad.get_book(book_id)

    return {
        "success": True,
        "data": book
    }, 200


@book_manager_blueprint.route("/api/book", methods=["GET"])
def get_all_books():
    libad = LibraryAdminService()

    all_books = libad.get_all_books()

    return {
        "success": True,
        "data": all_books
    }, 200


@book_manager_blueprint.route("/api/book/<book_id>", methods=["DELETE"])
def remove_book(book_id):
    libad = LibraryAdminService()

    remove_book = libad.remove_book(book_id)

    return {
        "success": True,
        "message": "Book removed successfully",
    }, 200


@book_manager_blueprint.route("/api/book/<book_id>", methods=["PUT"])
def update_book(book_id):
    libad = LibraryAdminService()

    update_book = libad.update_book(book_id)

    return {
        "success": True,
        "message": "Book updated successfully",
    }, 200


@book_manager_blueprint.route("/api/book/search", methods=["GET"])
def search_book():
    libad = LibraryAdminService()
    title = request.args.get("title")

    search_book_by_title = libad.search_book_by_title({"title": title})

    return {
        "success": True,
        "message": "Book searched",
        "data": {
            "book": search_book_by_title
        }
    }
