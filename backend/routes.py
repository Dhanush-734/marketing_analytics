from flask import jsonify, request
from analytics import calculate_roi, summarize_campaigns
from auth import validate_user
from models import Campaign, Customer

campaigns = [
    Campaign(1, 'Spring Launch', 12000, 18000),
    Campaign(2, 'Summer Push', 18000, 24000),
    Campaign(3, 'Holiday Sale', 25000, 32000),
]

customers = [
    Customer(1, 'Alice Johnson', 'VIP', 92),
    Customer(2, 'Bob Smith', 'High Value', 88),
    Customer(3, 'Cara Lee', 'Regular', 74),
]


def register_routes(app):
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data.get('username', '')
        password = data.get('password', '')
        if validate_user(username, password):
            return jsonify({"success": True, "message": "Login successful"})
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    @app.route('/api/campaigns', methods=['GET'])
    def get_campaigns():
        return jsonify([
            {"id": c.id, "name": c.name, "spend": c.spend, "revenue": c.revenue, "roi": calculate_roi(c.spend, c.revenue)}
            for c in campaigns
        ])

    @app.route('/api/analytics/summary', methods=['GET'])
    def analytics_summary():
        return jsonify(summarize_campaigns(campaigns))

    @app.route('/api/customers', methods=['GET'])
    def get_customers():
        return jsonify([
            {"id": c.id, "name": c.name, "segment": c.segment, "score": c.score}
            for c in customers
        ])
