from flask import Blueprint, request, jsonify
from application.database import articles_collection
from application.articles.article_schema import validate_article
from bson import ObjectId
from datetime import datetime
from bson.timestamp import Timestamp

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
                convert_document(item) if isinstance(item, dict) 
                else (str(item) if isinstance(item, ObjectId) or isinstance(item, Timestamp) else item)
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
    return jsonify({
        "message": "Article created successfully!",
        "id": str(result.inserted_id)
    }), 201

@articles.route("/", methods=["GET"])
def list_articles():
    articles_cursor = articles_collection.find()
    articles_list = []
    for article in articles_cursor:
        articles_list.append(convert_document(article))
    return jsonify(articles_list), 200

@articles.route("/<id>", methods=["GET"])
def get_article(id):
    article = articles_collection.find_one({"_id": ObjectId(id)})
    if article:
        article = convert_document(article)
        return jsonify(article), 200
    return jsonify({"error": "Article not found"}), 404

@articles.route("/<id>", methods=["PUT"])
def update_article(id):
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

    article_doc["updated_at"] = Timestamp(int(datetime.utcnow().timestamp()), 1)

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