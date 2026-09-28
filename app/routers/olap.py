from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import olap

router = APIRouter(prefix="/api/olap", tags=["olap"])

@router.get("/rollup")
def get_rollup(dimension: str = 'location'):
    return olap.get_rollup(dimension)

@router.get("/drilldown")
def get_drilldown():
    return olap.get_drilldown()

@router.get("/slice")
def get_slice(dimension: str = 'location', value: str = 'Delhi', db: Session = Depends(get_db)):
    return olap.get_slice(dimension, value, db)

@router.get("/dice")
def get_dice(dimension1: str = 'location', value1: str = 'Delhi', dimension2: str = 'category', value2: str = 'Electronics', db: Session = Depends(get_db)):
    return olap.get_dice(dimension1, value1, dimension2, value2, db)

@router.get("/pivot")
def get_pivot(dimensions: str = 'location,time', db: Session = Depends(get_db)):
    return olap.get_pivot(dimensions, db)
