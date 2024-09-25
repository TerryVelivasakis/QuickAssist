import eventlet
eventlet.monkey_patch()

from app import create_app, socketio

app = create_app()

if __name__ == '__main__':
    # Start the app with WebSocket support (socketio)
    print("I worked")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, use_reloader=False)
