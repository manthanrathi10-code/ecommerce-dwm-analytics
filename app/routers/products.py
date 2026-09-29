from fastapi import APIRouter, Query
from typing import Optional
from app.database import engine
import pandas as pd

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/")
def list_products(category: Optional[str] = None):
    query = """
        SELECT 
            p.product_id,
            p.product_name, 
            p.category, 
            SUM(f.quantity) as quantity_sold, 
            SUM(f.total_amount) as revenue, 
            SUM(f.profit) as profit, 
            AVG(f.unit_price) as avg_selling_price, 
            COUNT(DISTINCT f.order_id) as order_count
        FROM fact_sales f
        JOIN dim_product p ON f.product_key = p.product_key
    """
    
    params = {}
    if category:
        query += " WHERE LOWER(TRIM(p.category)) = LOWER(TRIM(%(category)s)) "
        params['category'] = category
        
    query += " GROUP BY p.product_id, p.product_name, p.category ORDER BY revenue DESC "
    
    df = pd.read_sql(query, engine, params=params if category else None)
    return df.to_dict(orient="records")

@router.get("/analytics")
def get_analytics(category: Optional[str] = None):
    return list_products(category)
