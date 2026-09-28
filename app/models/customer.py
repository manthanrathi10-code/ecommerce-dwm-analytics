from sqlalchemy import Column, Integer, String
from app.database import Base

class DimCustomer(Base):
    __tablename__ = "dim_customer"

    customer_key = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(String, unique=True, index=True, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_age = Column(Integer)
    customer_gender = Column(String)
