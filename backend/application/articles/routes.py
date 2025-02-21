from pprint import PrettyPrinter, pprint
from flask import Blueprint, request, jsonify
from application.database import articles_collection
from application.articles.article_schema import validate_article
from bson import ObjectId
from datetime import datetime
from application.database import users_collection
from bson.timestamp import Timestamp  # Added import for Timestamp

articles = Blueprint("articles", __name__, url_prefix="/articles")


def convert_document(doc):
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif isinstance(value, Timestamp):
            doc[key] = str(value)
        elif isinstance(value, dict):
            doc[key] = convert_document(value)
        elif isinstance(value, list):
            doc[key] = [
                (
                    convert_document(item)
                    if isinstance(item, dict)
                    else (
                        str(item)
                        if isinstance(item, ObjectId) or isinstance(item, Timestamp)
                        else item
                    )
                )
                for item in value
            ]
    return doc


@articles.route("/", methods=["POST"])
def create_article():
    data = request.json
    validated_article, errors = validate_article(data)
    if errors:
        return jsonify({"errors": errors}), 400

    article_doc = validated_article.dict()

    if article_doc.get("thumbnail"):
        article_doc["thumbnail"] = str(article_doc["thumbnail"])

    try:
        article_doc["author_id"] = ObjectId(article_doc["author_id"])
    except Exception:
        return jsonify({"error": "Invalid author_id format"}), 400

    try:
        article_doc["category_id"] = ObjectId(article_doc["category_id"])
    except Exception:
        return jsonify({"error": "Invalid category_id format"}), 400

    now_ts = Timestamp(int(datetime.utcnow().timestamp()), 1)
    article_doc["created_at"] = now_ts
    article_doc["updated_at"] = now_ts

    result = articles_collection.insert_one(article_doc)
    return (
        jsonify(
            {"message": "Article created successfully!", "id": str(result.inserted_id)}
        ),
        201,
    )


@articles.route("/", methods=["GET"])
def list_articles():
    articles_cursor = articles_collection.find()
    articles_list = []
    for article in articles_cursor:
        article["_id"] = str(article["_id"])

        # Fetch author username and category name
        author = articles_collection.database.users.find_one(
            {"_id": ObjectId(article["author_id"])}
        )
        category = articles_collection.database.categories.find_one(
            {"_id": ObjectId(article["category_id"])}
        )

        if author:
            article["author_id"] = author["username"]
        else:
            article["author_id"] = None

        if category:
            article["category_id"] = category["name"]
        else:
            article["category_id"] = None

        # Apply serialization to convert Timestamp/datetime fields
        article = convert_document(article)
        articles_list.append(article)
    return jsonify(articles_list), 200


@articles.route("/<id>", methods=["GET"])
def get_article(id):
    article = articles_collection.find_one({"_id": ObjectId(id)})
    if article:
        article["_id"] = str(article["_id"])

        # Fetch author username and category name
        author = articles_collection.database.users.find_one(
            {"_id": ObjectId(article["author_id"])}
        )
        category = articles_collection.database.categories.find_one(
            {"_id": ObjectId(article["category_id"])}
        )

        if author:
            article["author_id"] = author["username"]
        else:
            article["author_id"] = None

        if category:
            article["category_id"] = category["name"]
        else:
            article["category_id"] = None

        article = convert_document(article)
        return jsonify(article), 200
    return jsonify({"error": "Article not found"}), 404


@articles.route("/<id>", methods=["PUT"])
def update_article(id):
    data = request.json
    validated_article, errors = validate_article(data)
    if errors:
        return jsonify({"errors": errors}), 400

    article_doc = validated_article.model_dump()

    if article_doc.get("thumbnail"):
        article_doc["thumbnail"] = str(article_doc["thumbnail"])

    try:
        article_doc["author_id"] = ObjectId(article_doc["author_id"])
    except Exception:
        return jsonify({"error": "Invalid author_id format"}), 400

    try:
        article_doc["category_id"] = ObjectId(article_doc["category_id"])
    except Exception:
        return jsonify({"error": "Invalid category_id format"}), 400

    article_doc["updated_at"] = Timestamp(int(datetime.utcnow().timestamp()), 1)

    result = articles_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": article_doc}
    )
    if result.matched_count:
        return jsonify({"message": "Article updated successfully"}), 200
    return jsonify({"error": "Article not found"}), 404


@articles.route("/<id>", methods=["DELETE"])
def delete_article(id):
    result = articles_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "Article deleted successfully"}), 200
    return jsonify({"error": "Article not found"}), 404


@articles.route("/by/<user_id>", methods=["GET"])
def get_articles_by_user(user_id):
    try:
        # Directly search articles with author_id equal to user_id
        articles_cursor = articles_collection.find({"author_id": ObjectId(user_id)})
        articles_list = []
        for article in articles_cursor:
            article["_id"] = str(article["_id"])
            author = articles_collection.database.users.find_one(
                {"_id": ObjectId(article["author_id"])}
            )
            category = articles_collection.database.categories.find_one(
                {"_id": ObjectId(article["category_id"])}
            )
            if author:
                article["author_id"] = author["username"]
            else:
                article["author_id"] = None
            if category:
                article["category_id"] = category["name"]
            else:
                article["category_id"] = None
            article = convert_document(article)
            articles_list.append(article)
        return jsonify(articles_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@articles.route("/favorite", methods=["POST"])
def get_user_favorites():
    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid user_id format"}), 400

    user = users_collection.find_one({"_id": user_obj_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    favorite_ids = user.get("favorite", [])
    favorites_cursor = articles_collection.find({"_id": {"$in": favorite_ids}})
    favorites_list = []
    for article in favorites_cursor:
        article["_id"] = str(article["_id"])
        author = articles_collection.database.users.find_one(
            {"_id": ObjectId(article["author_id"])}
        )
        category = articles_collection.database.categories.find_one(
            {"_id": ObjectId(article["category_id"])}
        )
        article["author_id"] = author["username"] if author else None
        article["category_id"] = category["name"] if category else None
        favorites_list.append(convert_document(article))
    return jsonify(favorites_list), 200

@articles.route("/<article_id>/favorite", methods=["POST"])
def add_favorite(article_id):
    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    try:
        article_obj_id = ObjectId(article_id)
        user_obj_id = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid ID format"}), 400

    article = articles_collection.find_one({"_id": article_obj_id})
    if not article:
        return jsonify({"error": "Article not found"}), 404

    result = users_collection.update_one(
        {"_id": user_obj_id},
        {"$addToSet": {"favorite": article_obj_id}}
    )
    if result.matched_count:
        return jsonify({"message": "Article added to favorites"}), 200
    return jsonify({"error": "User not found"}), 404

@articles.route("/<article_id>/favorite", methods=["DELETE"])
def remove_favorite(article_id):
    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    try:
        article_obj_id = ObjectId(article_id)
        user_obj_id = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid ID format"}), 400

    article = articles_collection.find_one({"_id": article_obj_id})
    if not article:
        return jsonify({"error": "Article not found"}), 404

    result = users_collection.update_one(
        {"_id": user_obj_id},
        {"$pull": {"favorite": article_obj_id}}
    )
    if result.modified_count:
        return jsonify({"message": "Article removed from favorites"}), 200
    return jsonify({"error": "User not found or article was not in favorites"}), 404