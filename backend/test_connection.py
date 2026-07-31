from services.snowflake_service import SnowflakeService

try:
    conn = SnowflakeService().get_connection()
    print("Connected to Snowflake successfully!")

    cursor = conn.cursor()
    cursor.execute("SELECT CURRENT_VERSION();")
    print(cursor.fetchone())

    cursor.close()
    conn.close()

except Exception as e:
    print("Connection failed")
    print(e)
