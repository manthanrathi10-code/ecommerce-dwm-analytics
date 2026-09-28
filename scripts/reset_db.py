# Utility script: Drops and recreates all database tables based on the SQLAlchemy models.

from app.database import engine, Base
from app.models.customer import DimCustomer
from app.models.product import DimProduct
from app.models.location import DimLocation
from app.models.payment import DimPayment
from app.models.date import DimDate
from app.models.sales import FactSales

print("Dropping all tables...")
Base.metadata.drop_all(engine)
print("Recreating all tables...")
Base.metadata.create_all(engine)
print("Database reset successful.")
