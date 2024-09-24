from flask import Flask
from flask_cors import CORS
from .extensions import socketio
from .admin_routes import admin_bp
from .request_routes import requests_bp
from .dashboard_routes import dashboard_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable Cross-Origin requests

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
    socketio.run(app, debug=True)