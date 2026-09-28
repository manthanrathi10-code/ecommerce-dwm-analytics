from sqlalchemy import Column, Integer, String
from app.database import Base

class DimLocation(Base):
    __tablename__ = "dim_location"

    location_key = Column(Integer, primary_key=True, index=True, autoincrement=True)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
