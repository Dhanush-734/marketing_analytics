import logging
import os
from flask import Flask
from flask_cors import CORS
from config import Config
from routes.api import api as marketing_api
from swagger import api

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
DIST_DIR = os.path.join(FRONTEND_DIR, "dist")

app = Flask(
    __name__,
    static_folder=DIST_DIR if os.path.exists(DIST_DIR) else FRONTEND_DIR,
    static_url_path="",
)
app.config["SECRET_KEY"] = Config.SECRET_KEY

os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler("logs/app.log"),
        logging.StreamHandler(),
    ],
)

logger = logging.getLogger(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": "*",
        }
    },
)

from flask import Flask, Blueprint, send_from_directory, jsonify

api_bp = Blueprint("api_bp", __name__)
api.init_app(api_bp)
api.add_namespace(marketing_api)
app.register_blueprint(api_bp, url_prefix="/api")


@app.route("/")
def home():
    if os.path.exists(os.path.join(FRONTEND_DIR, "login.html")):
        return send_from_directory(FRONTEND_DIR, "login.html")
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify(
        {
            "project": "Marketing Campaign & Multi-Channel ROI Analytics Platform",
            "team": "Insight Innovators",
            "version": "1.0",
            "status": "Running Successfully",
        }
    )





@app.route("/login.html")
def login_page():
    return send_from_directory(FRONTEND_DIR, "login.html")


@app.route("/index.html")
def index_page():
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/assets/<path:filename>")
def serve_assets(filename):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(os.path.join(assets_dir, filename)):
        return send_from_directory(assets_dir, filename)
    return send_from_directory(FRONTEND_DIR, filename)


@app.route("/<path:filename>")
def serve_static(filename):
    if os.path.exists(os.path.join(DIST_DIR, filename)):
        return send_from_directory(DIST_DIR, filename)
    if os.path.exists(os.path.join(FRONTEND_DIR, filename)):
        return send_from_directory(FRONTEND_DIR, filename)
    public_dir = os.path.join(FRONTEND_DIR, "public")
    if os.path.exists(os.path.join(public_dir, filename)):
        return send_from_directory(public_dir, filename)
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return send_from_directory(FRONTEND_DIR, "login.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
