def validate_user(username, password):
    """
    Validates user credentials against the default admin details.
    """
    return username == "admin" and password == "admin123"
