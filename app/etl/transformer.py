import pandas as pd

class Transformer:
    def transform(self, df):
        # Dim Customer
        dim_customer = df[['customer_id', 'customer_name', 'customer_age', 'customer_gender']].drop_duplicates()
        
        # Dim Date
        df = df.copy()
        df['date_obj'] = pd.to_datetime(df['date'])
        dim_date = df[['date_obj']].drop_duplicates().copy()
        dim_date['full_date'] = dim_date['date_obj'].dt.date
        dim_date['day'] = dim_date['date_obj'].dt.day
        dim_date['month'] = dim_date['date_obj'].dt.month
        dim_date['year'] = dim_date['date_obj'].dt.year
        dim_date['quarter'] = dim_date['date_obj'].dt.quarter
        dim_date['day_of_week'] = dim_date['date_obj'].dt.dayofweek
        dim_date = dim_date.drop(columns=['date_obj'])
        
        # Dim Location
        dim_location = df[['city', 'state', 'country']].drop_duplicates()
        
        # Dim Payment
        dim_payment = df[['payment_method']].drop_duplicates()
        
        # Dim Product
        dim_product = df[['product_id', 'product_name', 'category', 'unit_price', 'cost_price']].drop_duplicates()
        
        # Fact Sales
        fact_sales = df[['order_id', 'date_obj', 'customer_id', 'product_id', 'city', 'state', 'country', 'payment_method', 'quantity', 'unit_price', 'discount', 'cost_price']].copy()
        
        fact_sales['total_amount'] = fact_sales['quantity'] * fact_sales['unit_price'] * (1 - fact_sales['discount'])
        fact_sales['cost_amount'] = fact_sales['quantity'] * fact_sales['cost_price']
        fact_sales['profit'] = fact_sales['total_amount'] - fact_sales['cost_amount']
        
        return {
            'dim_customer': dim_customer,
            'dim_date': dim_date,
            'dim_location': dim_location,
            'dim_payment': dim_payment,
            'dim_product': dim_product,
            'fact_sales': fact_sales
        }, len(fact_sales)
