from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.models.sales import FactSales
from app.models.date import DimDate
from app.models.product import DimProduct
from app.models.customer import DimCustomer
from app.models.location import DimLocation

def get_kpis(db: Session):
    total_revenue = db.query(func.sum(FactSales.total_amount)).scalar() or 0.0
    total_profit = db.query(func.sum(FactSales.profit)).scalar() or 0.0
    total_orders = db.query(func.count(func.distinct(FactSales.order_id))).scalar() or 0
    total_customers = db.query(func.count(func.distinct(FactSales.customer_key))).scalar() or 0
    return {
        "total_revenue": total_revenue,
        "total_profit": total_profit,
        "total_orders": total_orders,
        "total_customers": total_customers
    }

def get_sales_trend(db: Session):
    results = db.query(
        DimDate.year, DimDate.month, func.sum(FactSales.total_amount).label('revenue')
    ).join(FactSales, FactSales.date_key == DimDate.date_key)\
    .group_by(DimDate.year, DimDate.month)\
    .order_by(DimDate.year, DimDate.month).all()
    return [{"year": r.year, "month": r.month, "revenue": r.revenue} for r in results]

def get_category_sales(db: Session):
    results = db.query(
        DimProduct.category, func.sum(FactSales.total_amount).label('revenue')
    ).join(FactSales, FactSales.product_key == DimProduct.product_key)\
    .group_by(DimProduct.category).all()
    return [{"category": r.category, "revenue": r.revenue} for r in results]

def get_top_products(db: Session, limit: int = 5):
    results = db.query(
        DimProduct.product_name, func.sum(FactSales.total_amount).label('revenue')
    ).join(FactSales, FactSales.product_key == DimProduct.product_key)\
    .group_by(DimProduct.product_name)\
    .order_by(desc('revenue')).limit(limit).all()
    return [{"product_name": r.product_name, "revenue": r.revenue} for r in results]

def get_top_customers(db: Session, limit: int = 5):
    results = db.query(
        DimCustomer.customer_name, func.sum(FactSales.total_amount).label('revenue')
    ).join(FactSales, FactSales.customer_key == DimCustomer.customer_key)\
    .group_by(DimCustomer.customer_name)\
    .order_by(desc('revenue')).limit(limit).all()
    return [{"customer_name": r.customer_name, "revenue": r.revenue} for r in results]

def get_location_sales(db: Session):
    results = db.query(
        DimLocation.city, func.sum(FactSales.total_amount).label('revenue')
    ).join(FactSales, FactSales.location_key == DimLocation.location_key)\
    .group_by(DimLocation.city).all()
    return [{"city": r.city, "revenue": r.revenue} for r in results]
