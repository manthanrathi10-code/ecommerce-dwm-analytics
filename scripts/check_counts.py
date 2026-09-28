# Utility script: Prints row counts for all essential tables to confirm data has been seeded.

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    tables = ['dim_customer', 'dim_product', 'dim_date', 'dim_location', 'dim_payment', 'fact_sales']
    print("Table Row Counts:")
    for t in tables:
        cur.execute(f"SELECT count(*) FROM {t}")
        count = cur.fetchone()[0]
        print(f"{t}: {count}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
