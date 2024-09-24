# dashboard_routes.py
from flask import Blueprint, jsonify
from pymongo import MongoClient
from datetime import datetime

# MongoDB setup
client = MongoClient('mongodb://terry:password123@localhost:27017/')
db = client['supportApp']
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
