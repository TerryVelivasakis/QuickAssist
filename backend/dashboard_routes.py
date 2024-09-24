# dashboard_routes.py
from flask import Blueprint, jsonify
from pymongo import MongoClient

# Set up MongoDB connection
client = MongoClient('mongodb://terry:password123@localhost:27017/')
db = client['supportApp']
requests_collection = db['requests']

# Blueprint for dashboard-related routes
dashboard_bp = Blueprint('dashboard_bp', __name__)

# GET all requests for the dashboard (example route for showing help requests)
@dashboard_bp.route('/api/dashboard/requests', methods=['GET'])
def get_all_requests():
    try:
        requests = list(requests_collection.find({}))
        for req in requests:
            req['_id'] = str(req['_id'])  # Convert ObjectId to string
        return jsonify(requests)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
