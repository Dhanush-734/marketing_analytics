# Marketing Analytics Platform

This platform includes:
- An interactive React & TypeScript dashboard (with multi-channel ROI analytics, customer segmentation, email analytics, and SQL workspace)
- Direct Snowflake Cloud Data Warehouse telemetry (`MARKETING_ANALYTICS.MARKETING_SCHEMA.MARKETING_ETL`)
- Support for Snowflake, Alteryx ETL workflows, datasets, and reporting
- INSIGHTS AI marketing analytics copilot

## Structure

- frontend/: React UI application built with Vite, TypeScript, Tailwind CSS, Recharts & static login page
- backend/: Python Snowflake helper scripts and environment configuration (`config.py`, `services/snowflake_service.py`)
- datasets/: Raw and transformed marketing datasets
- alteryx/: Alteryx ETL workflow assets
- snowflake/: Snowflake SQL scripts and schema definitions
- powerbi/: Power BI reports and data model files
- automate/: Automation scripts and workflow helpers
- docs/: Product documentation and architecture notes
- screenshots/: UI and workflow screenshots

## How to Run the Project

### Start the React Dashboard

1. Navigate to the `frontend` directory and start the Vite dev server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open `http://localhost:5173/` in your browser.

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`
