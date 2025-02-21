from pprint import PrettyPrinter, pprint
from flask import Blueprint, request, jsonify
from application.database import articles_collection
from application.articles.article_schema import validate_article
from bson import ObjectId
from datetime import datetime
from application.database import users_collection
from bson.timestamp import Timestamp  # Added import for Timestamp

articles = Blueprint("articles", __name__, url_prefix="/articles")

def serialize_doc(doc):
    # Convert fields that are not JSON serializable to string
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif key == "updated_at" and isinstance(value, Timestamp):
            doc[key] = datetime.fromtimestamp(value.time).isoformat()
        elif isinstance(value, (datetime, Timestamp)):  # Updated to check for Timestamp as well
            # Use isoformat() if available, otherwise use str()
            doc[key] = value.isoformat() if hasattr(value, "isoformat") else str(value)
    return doc

@articles.route("/", methods=["POST"])
def create_article():
    data = request.json
    validated_article, errors = validate_article(data)
    if errors:
        return jsonify({"errors": errors}), 400

    # Ubah model Pydantic menjadi dictionary
    article_doc = validated_article.model_dump()

    # Jika thumbnail ada, konversi ke string (jika tidak None)
    if article_doc.get("thumbnail"):
        article_doc["thumbnail"] = str(article_doc["thumbnail"])
    
    # Konversi author_id dan category_id ke ObjectId
    try:
        article_doc["author_id"] = ObjectId(article_doc["author_id"])
    except Exception:
        return jsonify({"error": "Invalid author_id format"}), 400

    try:
        article_doc["category_id"] = ObjectId(article_doc["category_id"])
    except Exception:
        return jsonify({"error": "Invalid category_id format"}), 400

    result = articles_collection.insert_one(article_doc)
    return jsonify({
        "message": "Article created successfully!",
        "id": str(result.inserted_id)
    }), 201

@articles.route("/", methods=["GET"])
def list_articles():
    articles_cursor = articles_collection.find()
    articles_list = []
    for article in articles_cursor:
        article["_id"] = str(article["_id"])
        
        # Fetch author username and category name
        author = articles_collection.database.users.find_one({"_id": ObjectId(article["author_id"])})
        category = articles_collection.database.categories.find_one({"_id": ObjectId(article["category_id"])})
        
        if author:
            article["author_id"] = author["username"]
        else:
            article["author_id"] = None
        
        if category:
            article["category_id"] = category["name"]
        else:
            article["category_id"] = None
        
        # Apply serialization to convert Timestamp/datetime fields
        article = serialize_doc(article)
        articles_list.append(article)
    return jsonify(articles_list), 200

@articles.route("/<id>", methods=["GET"])
def get_article(id):
    article = articles_collection.find_one({"_id": ObjectId(id)})
    if article:
        article["_id"] = str(article["_id"])
        
        # Fetch author username and category name
        author = articles_collection.database.users.find_one({"_id": ObjectId(article["author_id"])})
        category = articles_collection.database.categories.find_one({"_id": ObjectId(article["category_id"])})
        
        if author:
            article["author_id"] = author["username"]
        else:
            article["author_id"] = None
        
        if category:
            article["category_id"] = category["name"]
        else:
            article["category_id"] = None
        
        article = serialize_doc(article)
        return jsonify(article), 200
    return jsonify({"error": "Article not found"}), 404

@articles.route("/<id>", methods=["PUT"])
def update_article(id):
    data = request.json
    validated_article, errors = validate_article(data)
    if errors:
        return jsonify({"errors": errors}), 400

    article_doc = validated_article.model_dump()

    # Fetch author username and category name
    author = articles_collection.database.users.find_one({"_id": ObjectId(article_doc["author_id"])})
    category = articles_collection.database.categories.find_one({"_id": ObjectId(article_doc["category_id"])})
    
    if not author:
        return jsonify({"error": "Author not found"}), 404
    if not category:
        return jsonify({"error": "Category not found"}), 404

    article_doc["author_id"] = author["username"]
    article_doc["category_id"] = category["name"]

    result = articles_collection.update_one({"_id": ObjectId(id)}, {"$set": article_doc})
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
            author = articles_collection.database.users.find_one({"_id": ObjectId(article["author_id"])})
            category = articles_collection.database.categories.find_one({"_id": ObjectId(article["category_id"])})
            if author:
                article["author_id"] = author["username"]
            else:
                article["author_id"] = None
            if category:
                article["category_id"] = category["name"]
            else:
                article["category_id"] = None
            article = serialize_doc(article)
            articles_list.append(article)
        return jsonify(articles_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
