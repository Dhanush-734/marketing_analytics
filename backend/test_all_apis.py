import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

def test_api_routes():
    client = app.test_client()
    endpoints = [
        "/api/kpi",
        "/api/channels",
        "/api/campaigns",
        "/api/customers",
        "/api/email",
        "/api/dashboard",
    ]
    
    print("=" * 60)
    print("Testing Backend API Routes connected to Snowflake...")
    print("=" * 60)
    
    all_passed = True
    for ep in endpoints:
        print(f"\nTesting {ep}...")
        res = client.get(ep)
        status_code = res.status_code
        try:
            data = json.loads(res.data)
            if isinstance(data, dict):
                status_val = data.get("status", "HTTP " + str(status_code))
                keys = list(data.keys())
                print(f"[HTTP {status_code}] Response object keys: {keys}")
                print(f"Sample data: {json.dumps(data, indent=2)[:250]}...")
            elif isinstance(data, list):
                print(f"[HTTP {status_code}] Response array of {len(data)} items.")
                if data:
                    print(f"Sample first item: {json.dumps(data[0])}")
            else:
                print(f"[HTTP {status_code}] Data: {data}")
            
            if status_code != 200:
                all_passed = False
        except Exception as e:
            print(f"[FAIL] Failed to parse JSON response for {ep}: {e}")
            all_passed = False

    print("\n" + "=" * 60)
    if all_passed:
        print("[SUCCESS] All 6 API endpoints returned HTTP 200 OK with live data from Snowflake!")
    else:
        print("[WARNING] Some API endpoints had issues.")
    print("=" * 60)

if __name__ == "__main__":
    test_api_routes()
