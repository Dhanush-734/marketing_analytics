from flask_restx import Api

api = Api(
    title="Marketing Analytics Platform API",
    version="1.0",
    description="""
Enterprise REST API

Features

• Snowflake Integration
• KPI Analytics
• Customer Analytics
• Campaign Analytics
• Email Analytics
• Dashboard Reporting

Developed by:
Insight Innovators
""",
    doc="/apidocs",
)


