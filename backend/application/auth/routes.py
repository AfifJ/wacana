from bson import ObjectId
import bcrypt
from application.database import articles_collection
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
        data["password"].encode("utf-8"), user["password"].encode("utf-8")
    ):
        return jsonify({"error": "Invalid email or password"}), 401

    return (
        jsonify(
            {
                "message": "Login successful",
                "user": {
                    "id": str(user["_id"]),
                    "email": user["email"],
                    "username": user["username"],
                    "photo_profile": user["photo_profile"],
                },
            }
        ),
        200,
    )


@auth.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    try:
        user = users_collection.find_one(
            {"_id": ObjectId(user_id)},
            {"username": 1, "email": 1, "photo_profile": 1},
        )
        if user:
            user["id"] = str(user["_id"])
            del user["_id"]
            return jsonify(user), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth.route("/profile/<user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.json
    update_data = {}

    if "username" in data:
        update_data["username"] = data["username"]
    if "email" in data:
        update_data["email"] = data["email"]
    if "newPassword" in data:
        update_data["password"] = hash_password(data["newPassword"])

    try:
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": update_data}
        )
        if result.matched_count:
            user = users_collection.find_one(
                {"_id": ObjectId(user_id)},
                {"username": 1, "email": 1, "photo_profile": 1},
            )
            if user:
                user["id"] = str(user["_id"])
            del user["_id"]
            return (
                jsonify({"message": "Profile updated successfully!", "user": user}),
                200,
            )
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
