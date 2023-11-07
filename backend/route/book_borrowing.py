from flask import Blueprint, request

from services.book_borrowing_service import BorrowingService

book_borrowing_blueprint = Blueprint("book_borrowing", __name__)

@book_borrowing_blueprint.route("/api/book_borrowing/borrow", methods=["POST"])
def borrow_book(bookid:str, userid:str):
    borrow = BorrowingService()

    userid = request.form.get("userid")
    bookid = request.form.get("bookid")

    if not userid or bookid:
        return {
            "success": False,
            "message": "UserID and BookID are required"
        }, 400

    borrowid = borrow.borrow_book(userid, bookid)
    return {
        "success": True,
        "message": f"borrow order #{borrowid} has been accepted"
    }, 200 

@book_borrowing_blueprint.route("/api/book_borrowing/extend_time", methods=["POST"])
def extend_time(borrowid:str):
    borrow = BorrowingService()

    borrowid = request.form.get("borrowid")
    extend_time = request.form.get("extend_time")

    if not borrowid or extend_time:
        return {
            "success": False,
            "message": "BorrowID and Extend time are required"
        }, 400
    
    new_return_date = borrow.extends_borrow_time(borrowid, extend_time)
    return {
        "success": True,
        "message": f"borrow order #{borrowid} borrow time has been extended for {extend_time}. Return date moved to {new_return_date}"
        }, 200


@book_borrowing_blueprint.route("/api/book_borrowing/check_return", methods = ["POST"])
def check_return(userid:str):
    borrow = BorrowingService()

    userid = request.form.get("userid")
    if not userid:
        return{
            "success": False,
            "message": "Userid required"
        }, 400

    checked_userid = borrow.check_user_return(userid)
    
    if checked_userid:
        return{
            "success": True,
            "message": "User has not returned book"
        }, 200
    
    if not checked_userid:
        return{
            "success": True,
            "message": "User has returned book"
        }, 200

@book_borrowing_blueprint.route("/api/book_borrowing/check_availability", methods = ["POST"])
def check_availability(bookid:str):
    borrow = BorrowingService()

    bookid = request.form.get("bookid")
    if not bookid:
        return{
            "succes": False,
            "message": "Bookid required"
        }, 400
     
    borrowed_copies = borrow.check_book_availability(bookid)
    return {
        "success": True,
        "message": f"{bookid} has {borrowed_copies} borrowed copies"
        }, 200
