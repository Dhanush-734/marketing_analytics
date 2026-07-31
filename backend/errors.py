def error_response(message, status_code=500):
    return {"status": "error", "message": message}, status_code


def success_response(data):
    return {"status": "success", "data": data}
