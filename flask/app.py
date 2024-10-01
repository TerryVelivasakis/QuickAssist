from . import create_app, socketio

# Create the Flask app instance
app = create_app()

# Main entry point for running the Flask app inside the container
if __name__ == "__main__":
    # Use socketio to run the app, exposing it on all interfaces with host='0.0.0.0'
    # and the standard port for Flask (5000)
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
