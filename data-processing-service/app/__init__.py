from flask import Flask

def create_app():
    app = Flask(__name__)

    from .routes import process_bp
    app.register_blueprint(process_bp)

    return app
