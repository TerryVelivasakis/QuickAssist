from flask import Flask
from flask_cors import CORS
from .admin_routes import admin_bp
from .request_routes import request_bp
from .dashboard_routes import dashboard_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable Cross-Origin requests
    
    # Register the blueprints
    app.register_blueprint(admin_bp)
    app.register_blueprint(request_bp)
    app.register_blueprint(dashboard_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
