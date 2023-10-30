from flask import Blueprint, request

from services.library_admin_service import LibraryAdminService

author_mng_blueprint = Blueprint("library_admin", __name__)

@author_mng_blueprint.route("/api/author/add", methods=["POST"])
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

