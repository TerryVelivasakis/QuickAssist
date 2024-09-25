from flask import Blueprint, request, jsonify
from bson import ObjectId 
from datetime import datetime, timezone
from pymongo import MongoClient
from .extensions import socketio, db  # Import the initialized SocketIO instance



requests_collection = db['requests']

# Blueprint for request-related routes
requests_bp = Blueprint('requests_bp', __name__)

# POST a new request
@requests_bp.route('/api/requests', methods=['POST'])
def create_request():
    try:
        data = request.get_json()
        room_id = data.get('roomId')
        issue_description = data.get('issueDescription', '')

        # Create the new request with a timestamp
        new_request = {
            'roomId': room_id,
            'issueDescription': issue_description,
            'createdAt': datetime.now(timezone.utc).isoformat()  # Use UTC timestamp
        }

        result = requests_collection.insert_one(new_request)
        new_request['_id'] = str(result.inserted_id)  # Convert ObjectId to string

        # Emit a WebSocket event for the new request
        socketio.emit('new_request', new_request)

        return jsonify({'message': 'Request submitted successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET all requests
@requests_bp.route('/api/requests', methods=['GET'])
def get_requests():
    try:
        requests = list(requests_collection.find({}))
        for request_item in requests:
            request_item['_id'] = str(request_item['_id'])  # Convert ObjectId to string
        return jsonify(requests)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE a request by ID
@requests_bp.route('/api/requests/<request_id>', methods=['DELETE'])
def delete_request(request_id):
    try:
        # Convert the request ID to ObjectId and attempt to delete
        result = requests_collection.delete_one({'_id': ObjectId(request_id)})
        
        if result.deleted_count == 1:
            # Emit the WebSocket event to notify other clients
            socketio.emit('request_deleted', {'_id': request_id})  # Notify frontend about the deletion
            return jsonify({'message': 'Request deleted successfully'}), 200
        else:
            # Return 404 if no document was found to delete
            return jsonify({'error': 'Request not found'}), 404
    except Exception as e:
        # Return 500 with the error message to help identify the issue
        return jsonify({'error': str(e)}), 500