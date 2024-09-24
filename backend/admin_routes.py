# admin_routes.py
from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from pymongo import MongoClient

# Set up MongoDB connection
client = MongoClient('mongodb://terry:password123@localhost:27017/')
db = client['supportApp']
rooms_collection = db['rooms']

# Blueprint for admin-related routes
admin_bp = Blueprint('admin_bp', __name__)

# POST a new room
@admin_bp.route('/api/rooms', methods=['POST'])
def create_room():
    data = request.get_json()
    
    # Create a roomId by stripping whitespace and converting spaces to hyphens
    room_id = data['name'].strip().replace(" ", "-").lower()

    new_room = {
        'roomId': room_id,  # Use the generated roomId
        'name': data['name'],
        'wikiLink': data['wikiLink']
    }
    
    rooms_collection.insert_one(new_room)
    return get_rooms()

# PUT to update a room
@admin_bp.route('/api/rooms/<room_id>', methods=['PUT'])
def update_room(room_id):
    data = request.get_json()
    rooms_collection.update_one(
        {'roomId': room_id},
        {'$set': {
            'name': data['name'],
            'wikiLink': data['wikiLink']
        }}
    )
    return get_rooms()

# DELETE a room
@admin_bp.route('/api/rooms/<room_id>', methods=['DELETE'])
def delete_room(room_id):
    rooms_collection.delete_one({'roomId': room_id})
    return get_rooms()

# GET all rooms (admin needs this too)
@admin_bp.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = list(rooms_collection.find({}))
    
    for room in rooms:
        room['_id'] = str(room['_id'])
    
    return jsonify(rooms)
