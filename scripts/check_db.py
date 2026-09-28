# Utility script: Basic sanity check to verify database connectivity using the configured DATABASE_URL.

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
if not db_url:
    print("DATABASE_URL not set in .env")
else:
    print(f"Connecting to: {db_url}")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        tables = cur.fetchall()
        print("Tables in public schema:")
        for table in tables:
            print(f"- {table[0]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")
