from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variables
#mongo_uri = os.getenv('MONGO_URI')
#mongo_uri = "mongodb://terry:password123@localhost:27018/supportApp"
# Create a MongoClient instance
#client = MongoClient(mongo_uri)

client = MongoClient('mongodb://terry:password123@localhost:27018/')
db = client['supportApp']
# Access the collection (e.g., 'rooms' collection)
rooms_collection = db['rooms']  # Access the 'rooms' collection

# Try to find one document in the collection (or do any other operation)
try:
    room = rooms_collection.find_one()  # Find one document in the 'rooms' collection
    if room:
        print("Found a document:", room)
    else:
        print("No documents found in the collection.")
except Exception as e:
    print(f"An error occurred: {e}")