from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from .extensions import db  # Import db from extensions


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
def update_room(room_id):
    data = request.get_json()

    # Check if the name has changed to update roomId, otherwise keep it the same
    existing_room = rooms_collection.find_one({'roomId': room_id})

    if existing_room and data['name'] != existing_room['name']:
        RoomData = CreateRoomData(data['name'], data['wikiLink'])
        updated_roomId = RoomData['roomId']  # fixed typo to use roomId
    else:
        RoomData = existing_room
        updated_roomId = room_id

    # Update the room with new data, only changing the roomId if the name has changed
    rooms_collection.update_one(
        {'roomId': room_id},
        {'$set': {
            'roomId': updated_roomId,  # Update roomId if necessary
            'name': RoomData['name'],
            'wikiLink': RoomData['wikiLink']
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