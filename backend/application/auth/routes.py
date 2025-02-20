from flask import Blueprint, jsonify, request
from application.database import client
from application.auth.user_schema import validate_user
from flask import Blueprint, request, jsonify
from application.database import users_collection

auth = Blueprint("auth", __name__, url_prefix="/auth")

@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    data = {
        'email': data['email'],
        'password': data['password']
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
    
    # Check if user exists and password matches
    if not user or user["password"] != data["password"]:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "email": user["email"]
        }
    }), 200