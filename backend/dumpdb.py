from pymongo import MongoClient

# Set up MongoDB connection
client = MongoClient('mongodb://terry:password123@localhost:27017/')
db = client['supportApp']

# Collections you want to clear
rooms_collection = db['rooms']
requests_collection = db['requests']

# Function to delete all documents in a collection
def clear_collection(collection):
    result = collection.delete_many({})
    print(f"Deleted {result.deleted_count} documents from {collection.name}")

# Clear the collections
clear_collection(rooms_collection)
clear_collection(requests_collection)

print("Database has been emptied.")
