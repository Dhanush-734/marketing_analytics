from services.snowflake_service import SnowflakeService

try:
    conn = SnowflakeService().get_connection()
    print("Connected to Snowflake successfully!")

    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM MARKETING_ETL;")
    print("Row count in MARKETING_ETL:", cursor.fetchone())

    cursor.close()
    conn.close()

except Exception as e:
    print("Failed to query MARKETING_ETL table:")
    print(e)
