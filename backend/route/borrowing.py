from flask import Blueprint, request

from services.book_borrowing_service import BookBorrowingService
from services.authorization_service import AuthorizationService

borrowing_blueprint = Blueprint("borrowing", __name__)
authorize = AuthorizationService()


@borrowing_blueprint.route("/api/borrowing", methods=["POST"])
@authorize.guard()
def request_borrow():
    book_borrowing = BookBorrowingService()

    book_id = request.form.get("bookid")

    if not book_id:
        return {
            "success": False,
            "message": "Book id, borrow date and return date are required",
        }, 400

    uid = request_borrow.auth.get("userid")

    try:
        book_borrowing.request_borrow(uid, book_id)

    except ValueError as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Borrow request sent successfully",
    }, 201


@borrowing_blueprint.route("/api/borrowing", methods=["GET"])
def get_all_borrowing():
    book_borrowing = BookBorrowingService()

    borrowings = book_borrowing.get_all_borrowing()

    return {
        "success": True,
        "message": "Borrowings retrieved successfully",
        "borrowings": borrowings
    }, 200


@borrowing_blueprint.route("/api/borrowing/<borrowing_id>/accept", methods=["PUT"])
@authorize.guard(role="admin")
def accept_borrow(borrowing_id):
    book_borrowing = BookBorrowingService()

    try:
        book_borrowing.accept_borrow(borrowing_id)

    except ValueError as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Borrow request accepted successfully",
    }, 200


@borrowing_blueprint.route("/api/borrowing/<borrowing_id>/reject", methods=["PUT"])
@authorize.guard(role="admin")
def reject_borrow(borrowing_id):
    book_borrowing = BookBorrowingService()

    try:
        book_borrowing.reject_borrow(borrowing_id)

    except ValueError as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Borrow request rejected successfully",
    }, 200

    
@borrowing_blueprint.route("/api/borrowing/user", methods=["GET"])
@authorize.guard()
def get_user_borrowing():
    book_borrowing = BookBorrowingService()

    uid = get_user_borrowing.auth.get("userid")
    borrowings = book_borrowing.get_user_borrowing(uid)

    return {
        "success": True,
        "message": "Borrowings retrieved successfully",
        "borrowings": borrowings
    }, 200

    
@borrowing_blueprint.route("/api/borrowing/<borrowing_id>/return", methods=["PUT"])
@authorize.guard()
def return_borrow(borrowing_id):
    book_borrowing = BookBorrowingService()

    try:
        uid = return_borrow.auth.get("userid")
        book_borrowing.return_borrow(uid, borrowing_id)

    except ValueError as e:
        return {
            "success": False,
            "message": e.args[0],
        }, 400

    return {
        "success": True,
        "message": "Borrow request returned successfully",
    }, 200
