# dashboard_routes.py
from flask import Blueprint, jsonify
from pymongo import MongoClient
from . import db
from bson import ObjectId

requests_collection = db['requests']

# Blueprint for dashboard-related routes
dashboard_bp = Blueprint('dashboard_bp', __name__)

# GET all help requests for the dashboard
@dashboard_bp.route('/api/requests', methods=['GET'])
def get_requests():
    try:
        requests = list(requests_collection.find({}))
        
        # Convert ObjectId to string and format createdAt
        for req in requests:
            req['_id'] = str(req['_id'])
            req['createdAt'] = req['createdAt'] if 'createdAt' in req else datetime.now().isoformat()

        return jsonify(requests), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@dashboard_bp.route('/api/test', methods=['GET'])
def test_mongo():
    print("Hi Mom!")
    try:
        db.command("ping")  # Ping MongoDB
        return jsonify({"message": "MongoDB connected!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500