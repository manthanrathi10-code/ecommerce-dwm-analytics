from sqlalchemy import Column, Integer, String
from app.database import Base

class DimPayment(Base):
    __tablename__ = "dim_payment"

    payment_key = Column(Integer, primary_key=True, index=True, autoincrement=True)
    payment_method = Column(String, unique=True, nullable=False)
