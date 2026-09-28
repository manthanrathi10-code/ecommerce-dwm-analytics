from fastapi import APIRouter
from app.services import mining

router = APIRouter(prefix="/api/mining", tags=["mining"])

@router.get("/clusters")
def get_clusters(n_clusters: int = 3):
    return mining.get_clusters(n_clusters)

@router.get("/association-rules")
def get_rules(min_support: float = 0.002):
    return mining.get_association_rules(min_support)

@router.get("/regression")
def get_regression():
    return mining.get_regression()

@router.get("/classification")
def get_classification():
    return mining.get_classification()

@router.get("/attribute-relevance")
def get_attribute_relevance():
    return mining.get_attribute_relevance()
