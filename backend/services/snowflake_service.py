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

        account = (Config.SNOWFLAKE_ACCOUNT or "WSTMXSC-HJ24814").strip()
        user = (Config.SNOWFLAKE_USER or "DHANUSH").strip()
        password = Config.SNOWFLAKE_PASSWORD or "DHANUSH@devi7977"
        warehouse = Config.SNOWFLAKE_WAREHOUSE or "COMPUTE_WH"
        database = Config.SNOWFLAKE_DATABASE or "MARKETING_ANALYTICS"
        schema = Config.SNOWFLAKE_SCHEMA or "MARKETING_SCHEMA"

        # Force valid account credentials when targeting the new account
        if "WSTMXSC" in account.upper() or user.upper() == "DHANUSH":
            account = "WSTMXSC-HJ24814"
            user = "DHANUSH"
            password = "DHANUSH@devi7977"
            warehouse = "COMPUTE_WH"
            database = "MARKETING_ANALYTICS"
            schema = "MARKETING_SCHEMA"

        conn_params = {
            "user": user,
            "password": password,
            "account": account,
            "warehouse": warehouse,
            "database": database,
            "schema": schema,
        }
        if getattr(Config, "SNOWFLAKE_ROLE", None):
            conn_params["role"] = Config.SNOWFLAKE_ROLE

        conn = snowflake.connector.connect(**conn_params)
        return conn
