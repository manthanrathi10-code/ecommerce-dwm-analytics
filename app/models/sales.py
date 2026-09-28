from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class FactSales(Base):
    __tablename__ = "fact_sales"

    sales_key = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(String, index=True, nullable=False)
    
    date_key = Column(Integer, ForeignKey("dim_date.date_key"), nullable=False)
    customer_key = Column(Integer, ForeignKey("dim_customer.customer_key"), nullable=False)
    product_key = Column(Integer, ForeignKey("dim_product.product_key"), nullable=False)
    location_key = Column(Integer, ForeignKey("dim_location.location_key"), nullable=False)
    payment_key = Column(Integer, ForeignKey("dim_payment.payment_key"), nullable=False)

    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    cost_amount = Column(Float, nullable=False)
    profit = Column(Float, nullable=False)

    # Relationships
    date = relationship("DimDate")
    customer = relationship("DimCustomer")
    product = relationship("DimProduct")
    location = relationship("DimLocation")
    payment = relationship("DimPayment")
