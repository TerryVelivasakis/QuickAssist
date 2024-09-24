# request_routes.py
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

# Set up MongoDB connection
client = MongoClient('mongodb://terry:password123@localhost:27017/')
db = client['supportApp']
requests_collection = db['requests']
rooms_collection = db['rooms']

# Blueprint for request-related routes
request_bp = Blueprint('request_bp', __name__)

# POST help request
@request_bp.route('/api/requests', methods=['POST'])
def create_request():
    try:
        data = request.get_json()
        room_id = data['roomId']
        issue_description = data['issueDescription']
        
        new_request = {
            'roomId': room_id,
            'issueDescription': issue_description,
            'createdAt': data.get('createdAt', ''),
        }
        requests_collection.insert_one(new_request)
        return jsonify({'message': 'Request submitted successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET room by roomId
@request_bp.route('/api/rooms/<room_id>', methods=['GET'])
def get_room(room_id):
    try:
        room = rooms_collection.find_one({'roomId': room_id})
        if room:
            return jsonify({
                'roomId': room['roomId'],
                'name': room['name'],
                'wikiLink': room['wikiLink']
            })
        else:
            return jsonify({'error': 'Room not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
