from flask import Flask
from flask_cors import CORS
from .extensions import socketio, db
from .admin_routes import admin_bp
from .request_routes import requests_bp
from .dashboard_routes import dashboard_bp
import os
from dotenv import load_dotenv


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})
    

    # Register the blueprints
    app.register_blueprint(admin_bp)
    app.register_blueprint(requests_bp)
    app.register_blueprint(dashboard_bp)

    # Initialize SocketIO with the app
    socketio.init_app(app, cors_allowed_origins="*")

    return app

if __name__ == '__main__':
    app = create_app()
    # Run the app using socketio instead of app.run
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)