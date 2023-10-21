from flask import Blueprint

lmao_blueprint = Blueprint('lmao', __name__)

@lmao_blueprint.route('/lmao')
def lmao():
    return 'lmao'