from flask_socketio import SocketIO
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize SocketIO
socketio = SocketIO()

# Initialize MongoDB connection
mongo_uri = os.getenv('MONGO_URI')
slack_uri = os.getenv('SLACK_URI')
print(slack_uri)

# Ensure the environment variable was loaded correctly
if not mongo_uri:
    raise ValueError("MONGO_URI is not set in the environment variables")

if not slack_uri:
    raise ValueError("SLACK_URI is not set in the environment variables")

# Create MongoClient using the URI
client = MongoClient(mongo_uri)

# Access the specific database (if you want to access a specific DB, include it in the URI)
db = client['supportApp']  # Use this if the database is part of the URI string
