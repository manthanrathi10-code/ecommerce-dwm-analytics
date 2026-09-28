from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import dashboard, olap, mining, products, customers, etl

app = FastAPI(title="E-commerce DWM Analytics")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(olap.router)
app.include_router(mining.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(etl.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
