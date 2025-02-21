from dotenv import load_dotenv, find_dotenv
import pprint
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi  # Add this import

load_dotenv(find_dotenv())

password = os.environ.get('MONGODB_PASSWORD')
username = os.environ.get('MONGODB_USERNAME')
uri = f"mongodb+srv://{username}:{password}@wacana.g92a7.mongodb.net/?retryWrites=true&w=majority&appName=wacana"

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    users_collection = client.wacana.users
    articles_collection = client.wacana.articles
except Exception as e:
    print("Error connecting to mongo")
    print(e)

