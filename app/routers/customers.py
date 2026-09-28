from fastapi import APIRouter
from app.database import engine
import pandas as pd

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("/")
def list_customers():
    query = """
        SELECT 
            c.customer_id,
            c.customer_name, 
            COUNT(DISTINCT f.order_id) as order_count, 
            SUM(f.total_amount) as total_spending, 
            SUM(f.total_amount) / COUNT(DISTINCT f.order_id) as avg_order_value, 
            SUM(f.quantity) as quantity, 
            MIN(d.full_date) as first_purchase, 
            MAX(d.full_date) as latest_purchase
        FROM fact_sales f
        JOIN dim_customer c ON f.customer_key = c.customer_key
        JOIN dim_date d ON f.date_key = d.date_key
        GROUP BY c.customer_id, c.customer_name
        ORDER BY total_spending DESC
    """
    
    df = pd.read_sql(query, engine)
    return df.to_dict(orient="records")

@router.get("/analytics")
def get_analytics():
    return list_customers()
