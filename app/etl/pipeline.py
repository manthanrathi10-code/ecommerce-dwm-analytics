import os
from dotenv import load_dotenv
from app.etl.extractor import Extractor
from app.etl.transformer import Transformer
from app.etl.loader import Loader

load_dotenv()

def run_pipeline():
    dataset_path = os.getenv("DATASET_PATH", "data/raw/ecommerce_india_10000_rows.csv")
    
    extractor = Extractor(dataset_path)
    df, initial, valid, rejected, dup = extractor.extract()
    
    transformer = Transformer()
    transformed_data, transformed_count = transformer.transform(df)
    
    loader = Loader()
    loaded_count = loader.load(transformed_data)
    
    stats = {
        "source_rows": initial,
        "valid_rows": valid,
        "rejected_rows": rejected,
        "duplicate_rows": dup,
        "transformed_rows": transformed_count,
        "loaded_rows": loaded_count
    }
    
    print("--- ETL STATS ---")
    for k, v in stats.items():
        print(f"{k}: {v}")
    print("-----------------")
        
    return stats

if __name__ == "__main__":
    run_pipeline()
