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

        user = Config.SNOWFLAKE_USER or "DHANUSH"
        password = Config.SNOWFLAKE_PASSWORD or "DHANUSH@devi7977"
        if password == "DHANUSHadevi7977":
            password = "DHANUSH@devi7977"
            
        warehouse = Config.SNOWFLAKE_WAREHOUSE or "COMPUTE_WH"
        if warehouse == "MARKETING_WH":
            warehouse = "COMPUTE_WH"

        conn_params = {
            "user": user,
            "password": password,
            "account": Config.SNOWFLAKE_ACCOUNT or "WSTMXSC-HJ24814",
            "warehouse": warehouse,
            "database": Config.SNOWFLAKE_DATABASE or "MARKETING_ANALYTICS",
            "schema": Config.SNOWFLAKE_SCHEMA or "MARKETING_SCHEMA",
        }
        if getattr(Config, "SNOWFLAKE_ROLE", None):
            conn_params["role"] = Config.SNOWFLAKE_ROLE

        conn = snowflake.connector.connect(**conn_params)
        return conn
