from fastapi import APIRouter
from app.etl import pipeline

router = APIRouter(prefix="/api/etl", tags=["etl"])

@router.post("/run")
def run_etl():
    stats = pipeline.run_pipeline()
    return {"status": "success", "stats": stats}

from app.services import etl_service

@router.get("/validate")
def validate():
    return etl_service.validate_etl()
