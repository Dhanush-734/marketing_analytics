from config import Config


class SnowflakeService:
    def __init__(self, account=None, user=None, password=None):
        self.account = account
        self.user = user
        self.password = password

    def ping(self):
        return {
            "status": "not_configured",
            "message": "Snowflake connection settings are pending",
        }

    def get_connection(self):
        import snowflake.connector

        conn = snowflake.connector.connect(
            user=Config.SNOWFLAKE_USER,
            password=Config.SNOWFLAKE_PASSWORD,
            account=Config.SNOWFLAKE_ACCOUNT,
            warehouse=Config.SNOWFLAKE_WAREHOUSE,
            database=Config.SNOWFLAKE_DATABASE,
            schema=Config.SNOWFLAKE_SCHEMA,
        )
        return conn
