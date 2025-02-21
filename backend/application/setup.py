from dotenv import load_dotenv, find_dotenv
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi  # Add this import

load_dotenv(find_dotenv())

password = os.environ.get("MONGODB_PASSWORD")
username = os.environ.get("MONGODB_USERNAME")
uri = f"mongodb+srv://{username}:{password}@wacana.g92a7.mongodb.net/?retryWrites=true&w=majority&appName=wacana"

client = MongoClient(uri, server_api=ServerApi("1"))
db = client.wacana

users_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "title": "User Object Validation",
        "required": ["_id", "username", "email", "password"],  # added _id
        "additionalProperties": False,  # added property
        "properties": {
            "_id": {  # added _id definition
                "bsonType": "objectId",
                "description": "'_id' is required",
            },
            "username": {
                "bsonType": "string",
                "description": "'username' must be a string and is required",
            },
            "email": {
                "bsonType": "string",
                "pattern": "^.+@.+\\..+$",
                "description": "'email' must be a valid email format and is required",
            },
            "password": {
                "bsonType": "string",
                "minLength": 8,
                "description": "Password must be at least 8 characters long",
            },
            "photo_profile": {
                "bsonType": ["null", "string"],
                "description": "'photo_profile' is an optional string",
            },
            "articles": {
                "bsonType": ["array", "null"],
                "items": {
                    "bsonType": "objectId"
                },
                "minItems": 0,
                "description": "'articles' is an array of article_ids",
            },
            "favorite": {
                "bsonType": ["array", "null"],
                "items": {
                    "bsonType": "objectId"  # updated to allow ObjectId values directly
                },
                "minItems": 0,
                "uniqueItems": True,
                "description": "'favorite' is an array of article_ids",
            },
            "updated_at": {
                "bsonType": ["null", "timestamp"],
                "description": "'updated_at' must be a timestamp",
            },
        },
    }
}

categories_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "title": "Category Object Validation",
        "required": ["_id", "name"],  # added _id
        "additionalProperties": False,  # added property
        "properties": {
            "_id": {  # added _id definition
                "bsonType": "objectId",
                "description": "'_id' is required",
            },
            "name": {
                "bsonType": "string",
                "description": "'name' must be a string and is required",
            },
            "updated_at": {
                "bsonType": ["null", "timestamp"],
                "description": "'updated_at' must be a timestamp",
            },
            "image": {
                "bsonType": ["null", "string"],
                "description": "'image' is an optional text field",
            },
        },
    }
}

articles_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "title": "Article Object Validation",
        "required": [
            "_id",
            "title",
            "content",
            "author_id",
            "category_id",
        ],  # added _id
        "additionalProperties": False,  # added property
        "properties": {
            "_id": {  # added _id definition
                "bsonType": "objectId",
                "description": "'_id' is required",
            },
            "title": {
                "bsonType": "string",
                "description": "'title' must be a string and is required",
            },
            "content": {
                "bsonType": "string",
                "description": "'content' must be text and is required",
            },
            "author_id": {
                "bsonType": "objectId",
                "description": "'author_id' must reference 'users._id'",
            },
            "category_id": {
                "bsonType": "objectId",
                "description": "'category_id' must reference 'categories._id'",
            },
            "is_live": {
                "bsonType": "bool",
                "description": "'is_live' is a boolean field",
            },
            "updated_at": {
                "bsonType": ["null", "timestamp"],
                "description": "'updated_at' must be a timestamp",
            },
        },
    }
}

# favorites_validator = {
#     "$jsonSchema": {
#         "bsonType": "object",
#         "title": "Favorite Object Validation",
#         "required": ["_id", "user_id", "article_id"],  # added _id
#         "additionalProperties": False,  # added property
#         "properties": {
#             "_id": {  # added _id definition
#                 "bsonType": "objectId",
#                 "description": "'_id' is required",
#             },
#             "user_id": {
#                 "bsonType": "objectId",
#                 "description": "'user_id' must reference 'users._id'",
#             },
#             "article_id": {
#                 "bsonType": "objectId",
#                 "description": "'article_id' must reference 'articles._id'",
#             },
#         },
#     }
# }

db.create_collection("users")
db.create_collection("categories")
db.create_collection("articles")
# db.create_collection("favorites")

db.command("collMod", "users", validator=users_validator)
db.command("collMod", "categories", validator=categories_validator)
db.command("collMod", "articles", validator=articles_validator)
# db.command("collMod", "favorites", validator=favorites_validator)
