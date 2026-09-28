import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.database import engine
from app.models.location import DimLocation
from app.models.product import DimProduct
from app.models.date import DimDate
from app.models.payment import DimPayment
from app.models.sales import FactSales

DIMENSION_MAP = {
    'location': (DimLocation, DimLocation.city, FactSales.location_key == DimLocation.location_key),
    'category': (DimProduct, DimProduct.category, FactSales.product_key == DimProduct.product_key),
    'time': (DimDate, DimDate.year, FactSales.date_key == DimDate.date_key),
    'year': (DimDate, DimDate.year, FactSales.date_key == DimDate.date_key),
    'payment_method': (DimPayment, DimPayment.payment_method, FactSales.payment_key == DimPayment.payment_key)
}

def get_rollup(dimension: str):
    dim_key = dimension.strip().lower() if dimension else ''
    if dim_key == 'location':
        query = """
            SELECT l.state, l.city, SUM(f.total_amount) as revenue
            FROM fact_sales f
            JOIN dim_location l ON f.location_key = l.location_key
            GROUP BY ROLLUP(l.state, l.city)
            ORDER BY l.state, l.city
        """
    elif dim_key == 'product':
        query = """
            SELECT p.category, p.product_name, SUM(f.total_amount) as revenue
            FROM fact_sales f
            JOIN dim_product p ON f.product_key = p.product_key
            GROUP BY ROLLUP(p.category, p.product_name)
            ORDER BY p.category, p.product_name
        """
    elif dim_key in ('time', 'date'):
        query = """
            SELECT d.year, d.month, SUM(f.total_amount) as revenue
            FROM fact_sales f
            JOIN dim_date d ON f.date_key = d.date_key
            GROUP BY ROLLUP(d.year, d.month)
            ORDER BY d.year, d.month
        """
    else:
        return []
        
    df = pd.read_sql(query, engine)
    # Fill NaN from ROLLUP with 'ALL'
    df = df.fillna('ALL')
    return df.to_dict(orient="records")

def get_drilldown():
    query = """
        SELECT d.year, d.quarter, d.month, SUM(f.total_amount) as revenue
        FROM fact_sales f
        JOIN dim_date d ON f.date_key = d.date_key
        GROUP BY d.year, d.quarter, d.month
        ORDER BY d.year, d.quarter, d.month
    """
    df = pd.read_sql(query, engine)
    return df.to_dict(orient="records")

def get_slice(dimension: str, value: str, db: Session):
    dimension_key = dimension.strip().lower() if dimension else ''
    if dimension_key not in DIMENSION_MAP:
        raise HTTPException(status_code=400, detail=f"Invalid dimension: {dimension}. Valid options are: {', '.join(DIMENSION_MAP.keys())}")
    
    model, column, join_cond = DIMENSION_MAP[dimension_key]
    
    if dimension_key in ['location', 'category', 'payment_method']:
        filter_cond = func.lower(func.trim(column)) == value.strip().lower()
    else:
        filter_cond = column == value
        
    query = db.query(column.label(dimension_key), func.sum(FactSales.total_amount).label('revenue')) \
              .join(model, join_cond) \
              .filter(filter_cond) \
              .group_by(column)
              
    results = query.all()
    return [dict(row._mapping) for row in results]

def get_dice(dimension1: str, value1: str, dimension2: str, value2: str, db: Session):
    dim1_key = dimension1.strip().lower() if dimension1 else ''
    dim2_key = dimension2.strip().lower() if dimension2 else ''
    
    for raw_dim, dim_key in [(dimension1, dim1_key), (dimension2, dim2_key)]:
        if dim_key not in DIMENSION_MAP:
            raise HTTPException(status_code=400, detail=f"Invalid dimension: {raw_dim}. Valid options are: {', '.join(DIMENSION_MAP.keys())}")
            
    model1, col1, join1 = DIMENSION_MAP[dim1_key]
    model2, col2, join2 = DIMENSION_MAP[dim2_key]
    
    filter_conds = []
    for dim_key, col, val in [(dim1_key, col1, value1), (dim2_key, col2, value2)]:
        if dim_key in ['location', 'category', 'payment_method']:
            filter_conds.append(func.lower(func.trim(col)) == val.strip().lower())
        else:
            filter_conds.append(col == val)
    
    query = db.query(col1.label(dim1_key), col2.label(dim2_key), func.sum(FactSales.total_amount).label('revenue')) \
              .join(model1, join1) \
              .join(model2, join2) \
              .filter(*filter_conds) \
              .group_by(col1, col2)
              
    results = query.all()
    return [dict(row._mapping) for row in results]

def get_pivot(dimensions_str: str, db: Session):
    raw_dimensions = [d.strip() for d in dimensions_str.split(',') if d.strip()]
    if len(raw_dimensions) != 2:
        raise HTTPException(status_code=400, detail="Pivot requires exactly two dimensions, comma-separated.")
        
    normalized_dims = []
    for dim in raw_dimensions:
        dim_key = dim.lower()
        if dim_key not in DIMENSION_MAP:
            raise HTTPException(status_code=400, detail=f"Invalid dimension: {dim}. Valid options are: {', '.join(DIMENSION_MAP.keys())}")
        normalized_dims.append(dim_key)
            
    dim1, dim2 = normalized_dims
    model1, col1, join1 = DIMENSION_MAP[dim1]
    model2, col2, join2 = DIMENSION_MAP[dim2]
    
    query = db.query(col1.label(dim1), col2.label(dim2), func.sum(FactSales.total_amount).label('revenue')) \
              .join(model1, join1) \
              .join(model2, join2) \
              .group_by(col1, col2)
              
    results = query.all()
    if not results:
        return []
        
    df = pd.DataFrame([dict(r._mapping) for r in results])
    pivot_df = df.pivot_table(index=dim1, columns=dim2, values='revenue', aggfunc='sum').fillna(0)
    pivot_df = pivot_df.round(2)
    pivot_df.columns = pivot_df.columns.astype(str)
    
    return pivot_df.reset_index().to_dict(orient="records")
