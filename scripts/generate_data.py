# Utility script: Generates synthetic e-commerce data (CSV) and populates the PostgreSQL database.

import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_synthetic_data(num_orders=1500):
    np.random.seed(42)
    start_date = datetime(2023, 1, 1)
    
    customers = [f"C{str(i).zfill(4)}" for i in range(1, 501)]
    indian_first_names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Diya", "Saanvi", "Aanya", "Pari", "Ananya", "Aadhya", "Khushi", "Riya", "Avni", "Mahi"]
    
    products = [
        {"id": "P001", "name": "Laptop", "category": "Electronics", "cost": 45000, "price": 65000},
        {"id": "P002", "name": "Smartphone", "category": "Electronics", "cost": 20000, "price": 35000},
        {"id": "P003", "name": "Desk Chair", "category": "Furniture", "cost": 2000, "price": 4000},
        {"id": "P004", "name": "Coffee Table", "category": "Furniture", "cost": 3000, "price": 6000},
        {"id": "P005", "name": "T-Shirt", "category": "Apparel", "cost": 300, "price": 700},
        {"id": "P006", "name": "Jeans", "category": "Apparel", "cost": 800, "price": 2000},
    ]
    
    cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"]
    states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana", "Maharashtra", "West Bengal"]
    payments = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Cash on Delivery"]
    
    data = []
    
    for i in range(num_orders):
        order_id = f"ORD{str(i+1).zfill(6)}"
        date = (start_date + timedelta(days=int(np.random.randint(0, 365)))).strftime("%Y-%m-%d")
        
        customer_id = np.random.choice(customers)
        customer_name = f"{np.random.choice(indian_first_names)}_{customer_id}"
        customer_age = np.random.randint(18, 70)
        customer_gender = np.random.choice(["Male", "Female", "Other"])
        
        loc_idx = np.random.choice(len(cities))
        city = cities[loc_idx]
        state = states[loc_idx]
        
        payment = np.random.choice(payments)
        
        num_items = np.random.randint(2, 6) # 2 to 5 items
        selected_products = np.random.choice(products, num_items, replace=False)
        
        for prod in selected_products:
            qty = np.random.randint(1, 6)
            discount = np.random.choice([0, 0.05, 0.1, 0.15, 0.2], p=[0.5, 0.2, 0.15, 0.1, 0.05])
            
            data.append({
                "order_id": order_id,
                "date": date,
                "customer_id": customer_id,
                "customer_name": customer_name,
                "customer_age": customer_age,
                "customer_gender": customer_gender,
                "product_id": prod["id"],
                "product_name": prod["name"],
                "category": prod["category"],
                "unit_price": prod["price"],
                "cost_price": prod["cost"],
                "quantity": qty,
                "discount": discount,
                "city": city,
                "state": state,
                "country": "India",
                "payment_method": payment
            })
            
    df = pd.DataFrame(data)
    os.makedirs("data/raw", exist_ok=True)
    os.makedirs("data/processed", exist_ok=True)
    os.makedirs("data/rejected", exist_ok=True)
    
    df.to_csv("data/raw/synthetic_data.csv", index=False)
    print(f"Generated data/raw/synthetic_data.csv with {len(df)} records.")

if __name__ == "__main__":
    generate_synthetic_data()
