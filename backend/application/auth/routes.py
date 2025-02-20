import email
from flask import Blueprint, jsonify, request
from application.database import client
from application.schemas.user import validate_user
from flask import Blueprint, request, jsonify
from application.schemas.user import validate_user
from application.database import users_collection

auth = Blueprint("auth", __name__, url_prefix="/auth")

@auth.route("/register", methods=["POST"])
def register():
    data = {
        'email': request.form.get('email'),
        'password': request.form.get('password')
    }

    # Validate user input
    validated_user, errors = validate_user(data)
    if errors:
        return jsonify({"errors": errors}), 400

    # Check if email already exists
    if users_collection.find_one({"email": validated_user.email}):
        return jsonify({"error": "Email is already registered"}), 400

    # Save user to database
    users_collection.insert_one(validated_user.model_dump())

    return jsonify({"message": "User registered successfully!"}), 201



@auth.route("/all")
def all():
    users = list(client.sample_mflix.users.find())
    for user in users:
        user["_id"] = str(user["_id"])
    return jsonify(users)
