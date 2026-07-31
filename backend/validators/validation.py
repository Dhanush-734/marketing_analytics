from flask import jsonify


def validate_required_fields(data, fields):
    missing = []

    for field in fields:
        if field not in data:
            missing.append(field)

    if missing:
        return jsonify(
            {
                "status": "error",
                "message": f"Missing fields: {', '.join(missing)}",
            }
        ), 400

    return None
