from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import dashboard

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/kpis")
def get_kpis(db: Session = Depends(get_db)):
    return dashboard.get_kpis(db)

@router.get("/sales-trend")
def get_sales_trend(db: Session = Depends(get_db)):
    return dashboard.get_sales_trend(db)

@router.get("/category-sales")
def get_category_sales(db: Session = Depends(get_db)):
    return dashboard.get_category_sales(db)

@router.get("/top-products")
def get_top_products(db: Session = Depends(get_db)):
    return dashboard.get_top_products(db)

@router.get("/top-customers")
def get_top_customers(db: Session = Depends(get_db)):
    return dashboard.get_top_customers(db)

@router.get("/location-sales")
def get_location_sales(db: Session = Depends(get_db)):
    return dashboard.get_location_sales(db)
