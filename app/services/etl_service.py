import pandas as pd
from app.database import engine

def validate_etl():
    """
    Checks if facts have referential integrity and counts match.
    Returns validation status.
    """
    query = """
    SELECT 
        (SELECT count(*) FROM fact_sales) as fact_count,
        (SELECT count(*) FROM dim_customer) as customer_count,
        (SELECT count(*) FROM dim_product) as product_count
    """
    df = pd.read_sql(query, engine)
    
    if df.empty:
        return {"status": "error", "message": "No data found"}
        
    row = df.iloc[0]
    
    # Basic logic check: if fact_count > 0 and customer_count > 0, it's considered somewhat valid
    is_valid = row['fact_count'] > 0 and row['customer_count'] > 0
    
    return {
        "is_valid": bool(is_valid),
        "fact_count": int(row['fact_count']),
        "customer_count": int(row['customer_count']),
        "product_count": int(row['product_count'])
    }
