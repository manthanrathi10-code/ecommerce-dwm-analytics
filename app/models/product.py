from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class DimProduct(Base):
    __tablename__ = "dim_product"

    product_key = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(String, unique=True, index=True, nullable=False)
    product_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    unit_price = Column(Float)
    cost_price = Column(Float)
