import bcrypt
from dotenv import load_dotenv, find_dotenv
import os
from pymongo.mongo_client import MongoClient
from datetime import datetime
import bson
from bson import ObjectId  # added import for ObjectId
from pymongo.server_api import ServerApi
import random
from faker import Faker

load_dotenv(find_dotenv())

password = os.environ.get("MONGODB_PASSWORD")
username = os.environ.get("MONGODB_USERNAME")
uri = f"mongodb+srv://{username}:{password}@wacana.g92a7.mongodb.net/?retryWrites=true&w=majority&appName=wacana"

client = MongoClient(uri, server_api=ServerApi("1"))
db = client.wacana

fake = Faker()


# Helper function to convert datetime to bson timestamp
def datetime_to_timestamp(dt):
    return bson.Timestamp(int(dt.timestamp()), 1)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# Generate users
def generate_users(num_users):
    users = []
    for _ in range(num_users):
        now = datetime.now()
        user = {
            "_id": ObjectId(),  # added _id
            "username": fake.user_name(),
            "email": fake.email(),
            "password": hash_password("user1234"),
            "photo_profile": None,
            "favorite": None,
            "articles": [],  # added articles key
            "updated_at": datetime_to_timestamp(now),
        }
        users.append(user)
    return users


# Generate categories
def generate_categories(num_categories):
    categories = []
    for _ in range(num_categories):
        now = datetime.now()
        category = {
            "_id": ObjectId(),  # added _id
            "name": fake.word(),
            "updated_at": datetime_to_timestamp(now),
            "image": None,
        }
        categories.append(category)
    return categories


# Generate articles
def generate_articles(num_articles, user_ids, category_ids):
    articles = []
    user_articles = {user_id: [] for user_id in user_ids}  # Track articles for each user
    for _ in range(num_articles):
        now = datetime.now()
        author_id = random.choice(user_ids)
        article = {
            "_id": ObjectId(),  # added _id
            "title": fake.sentence(),
            "content": fake.text(max_nb_chars=200),
            "author_id": author_id,  # Use author_id directly
            "category_id": random.choice(category_ids),
            "is_live": random.choice([True, False]),
            "updated_at": datetime_to_timestamp(now),
        }
        articles.append(article)
        user_articles[author_id].append(article["_id"])  # Add article ID to user's articles
    return articles, user_articles


# Seed the database
def seed_database():
    # Create users
    users = generate_users(5)
    user_ids = []
    for user in users:
        result = db.users.insert_one(user)
        user_ids.append(result.inserted_id)

    # Create categories
    categories = generate_categories(10)
    category_ids = []
    for category in categories:
        result = db.categories.insert_one(category)
        category_ids.append(result.inserted_id)

    # Create articles
    articles, user_articles = generate_articles(40, user_ids, category_ids)
    article_ids = []
    for article in articles:
        result = db.articles.insert_one(article)
        article_ids.append(result.inserted_id)

    # Update user favorites and articles
    for user_id in user_ids:
        favorite_articles = random.sample(article_ids, k=4)
        db.users.update_one(
            {"_id": user_id},
            {"$set": {"favorite": favorite_articles, "articles": user_articles[user_id]}},
        )

# Run the seeding function
seed_database()
