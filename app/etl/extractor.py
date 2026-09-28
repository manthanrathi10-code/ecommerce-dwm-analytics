import pandas as pd
import os

class Extractor:
    def __init__(self, file_path):
        self.file_path = file_path
    
    def extract(self):
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"File {self.file_path} not found.")
        df = pd.read_csv(self.file_path)
        
        required_cols = ['order_id', 'date', 'customer_id', 'product_id']
        
        initial_count = len(df)
        df_valid = df.dropna(subset=required_cols)
        valid_count = len(df_valid)
        rejected_count = initial_count - valid_count
        
        df_dedup = df_valid.drop_duplicates()
        duplicate_count = valid_count - len(df_dedup)
        
        return df_dedup, initial_count, len(df_dedup), rejected_count, duplicate_count
