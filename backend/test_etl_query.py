import sys
import os

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.snowflake_service import SnowflakeService

def run_tests():
    print("=" * 60)
    print("Testing connection to new Snowflake account...")
    print("=" * 60)
    
    try:
        conn = SnowflakeService().get_connection()
        print("[SUCCESS] Connected to Snowflake!")
        cursor = conn.cursor()
        
        # Test 1: SELECT COUNT(*) FROM MARKETING_ANALYTICS.MARKETING_SCHEMA.MARKETING_ETL;
        print("\n--- Test 1: Querying Table Row Count ---")
        query1 = "SELECT COUNT(*) FROM MARKETING_ANALYTICS.MARKETING_SCHEMA.MARKETING_ETL;"
        print(f"Executing: {query1}")
        cursor.execute(query1)
        count_res = cursor.fetchone()
        print(f"[RESULT] Row count: {count_res[0] if count_res else 'N/A'}")
        
        # Test 2: SELECT * FROM MARKETING_ANALYTICS.MARKETING_SCHEMA.MARKETING_ETL LIMIT 10;
        print("\n--- Test 2: Retrieving Sample Records ---")
        query2 = "SELECT * FROM MARKETING_ANALYTICS.MARKETING_SCHEMA.MARKETING_ETL LIMIT 10;"
        print(f"Executing: {query2}")
        cursor.execute(query2)
        columns = [desc[0] for desc in cursor.description]
        records = cursor.fetchall()
        print(f"[RESULT] Retieved {len(records)} records.")
        print(f"Columns: {columns}")
        for i, row in enumerate(records, 1):
            print(f"  Record {i}: {row}")
            
        cursor.close()
        conn.close()
        print("\n[SUCCESS] All Snowflake tests passed successfully!")
        
    except Exception as e:
        print("\n[ERROR] Connection or query failed!")
        print(f"Exact Error Details:\n{e}")
        print("\nPossible causes / corrections needed:")
        print("1. Database 'MARKETING_ANALYTICS' or schema 'MARKETING_SCHEMA' does not exist in the new account.")
        print("2. Table 'MARKETING_ETL' has not been created or populated in the new account.")
        print("3. Warehouse 'COMPUTE_WH' is not started or user lacks privileges.")
        print("4. Check credentials in backend/.env")

if __name__ == "__main__":
    run_tests()
