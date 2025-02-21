import bcrypt
from flask import Blueprint, jsonify, request
from flask import Blueprint, request, jsonify
from application.database import users_collection
from application.auth.user_schema import hash_password, validate_user

auth = Blueprint("auth", __name__, url_prefix="/auth")


@auth.route("/register", methods=["POST"])
def register():
    data = request.json

    data = {
        "email": data["email"],
        "password": data["password"],
        "username": data["email"],
        "photo_profile": None,
    }

    validated_user, errors = validate_user(data)
    if errors:
        return jsonify({"errors": errors}), 400

    # Check if email already exists
    if users_collection.find_one({"email": validated_user.email}):
        return jsonify({"error": "Email is already registered"}), 400

    # Save user to database
    users_collection.insert_one(validated_user.model_dump())

    return jsonify({"message": "User registered successfully!"}), 201


@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    
    # Get user from database
    user = users_collection.find_one({"email": data["email"]})
    
    # Check if user exists and verify password
    if not user or not bcrypt.checkpw(
        data["password"].encode("utf-8"), 
        user["password"].encode("utf-8")
    ):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful", 
        "user": {"email": user["email"]}
    }), 200
