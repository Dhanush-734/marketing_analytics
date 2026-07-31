# Marketing Analytics Platform

This starter project includes:
- A Flask-based backend API for analytics and authentication
- An interactive React dashboard & login portal (with multi-channel analytics and Snowflake telemetry)
- Support for Snowflake, Alteryx workflows, datasets, and reporting

## Structure

- backend/: Flask application, REST API routes, analytics logic, and auth helpers
- frontend/: React UI application built with Vite, TypeScript, TailwindCSS & static login page
- datasets/: Place raw or processed marketing datasets here
- alteryx/: Alteryx workflow assets
- snowflake/: Snowflake SQL scripts and connection notes
- powerbi/: Power BI reports and data model files
- automate/: Automation scripts and scheduling files
- docs/: Product documentation and architecture notes
- screenshots/: UI and workflow screenshots

## How to Run the Project

### Step 1: Run the Backend Server

Since project dependencies (like `flask-restx` and `snowflake-connector-python`) are installed in the project's `.venv` virtual environment, run:

**Option A (Direct command in PowerShell / CMD):**
```powershell
.\.venv\Scripts\python.exe backend/app.py
```

**Option B (Activate virtual environment first):**
```powershell
.\.venv\Scripts\Activate.ps1
python backend/app.py
```

*(Optional: If using your system global Python, run `pip install -r backend/requirements.txt` first).*

### Step 2: Access the Application

Open your browser and navigate to:
- **Web App & Login**: [http://127.0.0.1:5000/](http://127.0.0.1:5000/) or [http://127.0.0.1:5000/login.html](http://127.0.0.1:5000/login.html)
- **Interactive React Dashboard**: [http://127.0.0.1:5000/index.html](http://127.0.0.1:5000/index.html)
- **Swagger API Documentation**: [http://127.0.0.1:5000/apidocs](http://127.0.0.1:5000/apidocs)

### Option 3: Run via Vite Frontend Dev Server

1. Start backend: `.\.venv\Scripts\python.exe backend/app.py`
2. In a separate terminal:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`


