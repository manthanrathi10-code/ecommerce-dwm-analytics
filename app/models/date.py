from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class DimDate(Base):
    __tablename__ = "dim_date"

    date_key = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_date = Column(Date, unique=True, index=True, nullable=False)
    day = Column(Integer)
    month = Column(Integer)
    year = Column(Integer)
    quarter = Column(Integer)
    day_of_week = Column(Integer)
