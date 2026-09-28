from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from app.database import engine
from app.models.customer import DimCustomer
from app.models.date import DimDate
from app.models.location import DimLocation
from app.models.payment import DimPayment
from app.models.product import DimProduct
import pandas as pd

class Loader:
    def load(self, transformed_data):
        with Session(engine) as session:
            # DimCustomer
            for _, row in transformed_data['dim_customer'].iterrows():
                stmt = insert(DimCustomer).values(
                    customer_id=row['customer_id'],
                    customer_name=row['customer_name'],
                    customer_age=row['customer_age'],
                    customer_gender=row['customer_gender']
                ).on_conflict_do_nothing(index_elements=['customer_id'])
                session.execute(stmt)
            
            # DimDate
            for _, row in transformed_data['dim_date'].iterrows():
                stmt = insert(DimDate).values(
                    full_date=row['full_date'],
                    day=row['day'],
                    month=row['month'],
                    year=row['year'],
                    quarter=row['quarter'],
                    day_of_week=row['day_of_week']
                ).on_conflict_do_nothing(index_elements=['full_date'])
                session.execute(stmt)

            # DimProduct
            for _, row in transformed_data['dim_product'].iterrows():
                stmt = insert(DimProduct).values(
                    product_id=row['product_id'],
                    product_name=row['product_name'],
                    category=row['category'],
                    unit_price=row['unit_price'],
                    cost_price=row['cost_price']
                ).on_conflict_do_nothing(index_elements=['product_id'])
                session.execute(stmt)

            # DimPayment
            for _, row in transformed_data['dim_payment'].iterrows():
                stmt = insert(DimPayment).values(
                    payment_method=row['payment_method']
                ).on_conflict_do_nothing(index_elements=['payment_method'])
                session.execute(stmt)
            
            session.commit()

            # Location (no unique constraint on city/state/country in model, so query to avoid dupes)
            existing_locs = pd.read_sql_query("SELECT location_key, city, state, country FROM dim_location", engine)
            new_locs = transformed_data['dim_location']
            if not existing_locs.empty:
                merged = new_locs.merge(existing_locs, on=['city', 'state', 'country'], how='left')
                to_insert = merged[merged['location_key'].isna()][['city', 'state', 'country']]
            else:
                to_insert = new_locs
            
            if not to_insert.empty:
                to_insert.to_sql('dim_location', engine, if_exists='append', index=False)
            
            session.commit()

            # Build facts
            customers = pd.read_sql_query("SELECT customer_key, customer_id FROM dim_customer", engine)
            dates = pd.read_sql_query("SELECT date_key, full_date FROM dim_date", engine)
            products = pd.read_sql_query("SELECT product_key, product_id FROM dim_product", engine)
            payments = pd.read_sql_query("SELECT payment_key, payment_method FROM dim_payment", engine)
            locations = pd.read_sql_query("SELECT location_key, city, state, country FROM dim_location", engine)

            facts = transformed_data['fact_sales']
            facts['full_date'] = facts['date_obj'].dt.date

            facts = facts.merge(customers, on='customer_id', how='left')
            # convert dates['full_date'] to object type if necessary to match
            dates['full_date'] = pd.to_datetime(dates['full_date']).dt.date
            facts = facts.merge(dates, on='full_date', how='left')
            facts = facts.merge(products, on='product_id', how='left')
            facts = facts.merge(payments, on='payment_method', how='left')
            facts = facts.merge(locations, on=['city', 'state', 'country'], how='left')

            facts_to_load = facts[['order_id', 'date_key', 'customer_key', 'product_key', 'location_key', 'payment_key', 'quantity', 'unit_price', 'discount', 'total_amount', 'cost_amount', 'profit']]
            
            facts_to_load.to_sql('fact_sales', engine, if_exists='append', index=False)
            
            return len(facts_to_load)
