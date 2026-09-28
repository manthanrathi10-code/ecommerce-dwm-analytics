# Utility script: Validates the generated dataset CSV against the expected schema and constraints.

import pandas as pd

def validate_csv(filepath="data/raw/ecommerce_india_10000_rows.csv"):
    df = pd.read_csv(filepath)
    
    print("--- CSV VALIDATION ---")
    print(f"Total Rows: {len(df)}")
    
    expected_columns = [
        "order_id", "date", "customer_id", "customer_name", "customer_age", "customer_gender", 
        "registration_date", "product_id", "product_name", "category", "subcategory", "brand", 
        "unit_price", "cost_price", "quantity", "discount", "city", "state", "region", "country", "payment_method"
    ]
    
    missing_cols = [c for c in expected_columns if c not in df.columns]
    print(f"Missing Columns: {missing_cols if missing_cols else 'None'}")
    
    null_counts = df.isnull().sum().sum()
    print(f"Total Null Values: {null_counts}")
    
    print(f"Unique Customers: {df['customer_id'].nunique()}")
    print(f"Unique Products: {df['product_id'].nunique()}")
    print(f"Unique Orders: {df['order_id'].nunique()}")
    
    print(f"Min Date: {df['date'].min()}")
    print(f"Max Date: {df['date'].max()}")
    
    print(f"Country Values: {df['country'].unique()}")
    print(f"Currency validation: Cost Price < Unit Price for all rows? {(df['cost_price'] < df['unit_price']).all()}")
    
    print(f"Min Unit Price: {df['unit_price'].min()}")
    print(f"Max Unit Price: {df['unit_price'].max()}")
    
    print(f"Cities: {len(df['city'].unique())} unique cities")
    
if __name__ == "__main__":
    validate_csv()
