from datetime import datetime
from flask import Blueprint, request

from services.library_admin_service import LibraryAdminService
from services.authorization_service import AuthorizationService

book_mng_blueprint = Blueprint("book_manager", __name__)
authorize = AuthorizationService()

@book_mng_blueprint.route("/api/books", methods=["POST"])
@authorize.guard(role="admin")
def add_book():
    libad = LibraryAdminService()

    title = request.form.get("title")
    authorid = request.form.get("authorid")
    publisherid = request.form.get("publisherid")
    pubdate = request.form.get("pubdate")
    instore = request.form.get("instore")

    libad.add_book({
        "title": title,
        "authorid": authorid,
        "publisherid": publisherid,
        "pubdate": pubdate,
        "instore": instore
    })

    return {
        "success": True,
        "message": "Book added successfully",
    }, 201


@book_mng_blueprint.route("/api/books/search", methods=["GET"])
def get_books():
    libad = LibraryAdminService()

    title = request.args.get("title", "")
    author = request.args.get("author", "")
    publisher = request.args.get("publisher", "")
    pubfrom = request.args.get("pubfr", "1000-01-01")
    pubto = request.args.get("pubto", "9999-12-31")

    books = libad.get_all_books({
        "title": title,
        "author": author,
        "publisher": publisher,
        "pubfrom": pubfrom,
        "pubto": pubto,
    })

    return {
        "success": True,
        "message": "Books retrieved successfully",
        "books": books
    }, 200
