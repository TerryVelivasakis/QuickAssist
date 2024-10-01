from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from pymongo import MongoClient
from .extensions import db  # Import db from extensions
from bson import ObjectId


rooms_collection = db['rooms']

def CreateRoomData(room_name, wiki_link):
    return {
        'roomId': room_name.strip().replace(" ", "-").lower(),  # fixed typo to use roomId
        'name': room_name,
        'wikiLink': wiki_link.strip()
    }

# Blueprint for admin-related routes
admin_bp = Blueprint('admin_bp', __name__)

# POST a new room
@admin_bp.route('/api/rooms', methods=['POST'])
def create_room():
    data = request.get_json()
    RoomData = CreateRoomData(data['name'], data['wikiLink'])
    
    new_room = {
        'roomId': RoomData['roomId'],  # Use the generated roomId
        'name': RoomData['name'],
        'wikiLink': RoomData['wikiLink']
    }
    
    rooms_collection.insert_one(new_room)
    return get_rooms()

# PUT to update a room
@admin_bp.route('/api/rooms/<room_id>', methods=['PUT'])
@cross_origin()  # Ensure CORS is enabled for this route
def update_room(room_id):
    data = request.get_json()

    try:
        # Convert room_id to ObjectId
        existing_room = rooms_collection.find_one({'_id': ObjectId(room_id)})

        if not existing_room:
            return jsonify({'error': 'Room not found'}), 404

        # Check if the name has changed to update roomId, otherwise keep it the same
        if data['name'] != existing_room['name']:
            RoomData = CreateRoomData(data['name'], data['wikiLink'])
            updated_roomId = RoomData['roomId']  # Update roomId if name has changed
        else:
            RoomData = existing_room
            updated_roomId = existing_room['roomId']  # Keep original roomId

        # Update the room with new data
        rooms_collection.update_one(
            {'_id': ObjectId(room_id)},
            {'$set': {
                'roomId': updated_roomId,
                'name': RoomData['name'],
                'wikiLink': RoomData['wikiLink']
            }}
        )
        return get_rooms()
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE a room
@admin_bp.route('/api/rooms/<room_id>', methods=['DELETE'])
def delete_room(room_id):
    try:
        # Convert room_id to ObjectId and delete the document by _id
        rooms_collection.delete_one({'_id': ObjectId(room_id)})
        return get_rooms()  # Return the updated list of rooms
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET all rooms (admin needs this too)
@admin_bp.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = list(rooms_collection.find({}))
    
    for room in rooms:
        room['_id'] = str(room['_id'])  # convert ObjectId to string for JSON serialization
    
    return jsonify(rooms)

@admin_bp.route('/api/rooms/<room_id>', methods=['GET'])
def get_room(room_id):
    try:
        room = rooms_collection.find_one({'roomId': room_id})  # Assuming you are using roomId
        if room:
            return jsonify({
                'roomId': room['roomId'],
                'name': room['name'],
                'wikiLink': room['wikiLink']
            }), 200
        else:
            return jsonify({'error': 'Room not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500