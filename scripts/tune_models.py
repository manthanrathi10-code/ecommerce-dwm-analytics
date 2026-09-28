import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pandas as pd
import numpy as np
from app.database import engine
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_validate
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import json

def run_experiment():
    print("1. Fetching data from database...", flush=True)
    query = """
        SELECT 
            c.customer_key,
            c.customer_id,
            c.customer_age,
            c.customer_gender,
            l.state,
            f.order_id,
            f.total_amount,
            f.discount,
            f.quantity,
            d.full_date,
            p.category,
            p.product_key
        FROM fact_sales f
        JOIN dim_customer c ON f.customer_key = c.customer_key
        JOIN dim_date d ON f.date_key = d.date_key
        JOIN dim_product p ON f.product_key = p.product_key
        JOIN dim_location l ON f.location_key = l.location_key
    """
    df = pd.read_sql(query, engine)
    df['full_date'] = pd.to_datetime(df['full_date'])
    max_date = df['full_date'].max()

    print("2. Aggregating customer features...", flush=True)
    cust = df.groupby('customer_id').agg(
        customer_age=('customer_age', 'first'),
        customer_gender=('customer_gender', 'first'),
        state=('state', lambda s: s.mode().iloc[0] if not s.empty else 'Unknown'),
        order_count=('order_id', 'nunique'),
        lifetime_spend=('total_amount', 'sum'),
        avg_discount=('discount', 'mean'),
        total_quantity=('quantity', 'sum'),
        category_diversity=('category', 'nunique'),
        product_diversity=('product_key', 'nunique'),
        first_purchase=('full_date', 'min'),
        last_purchase=('full_date', 'max')
    ).reset_index()

    cust['avg_order_value'] = cust['lifetime_spend'] / cust['order_count']
    cust['recency_days'] = (max_date - cust['last_purchase']).dt.days
    cust['tenure_days'] = (max_date - cust['first_purchase']).dt.days
    cust['purchase_frequency'] = cust['order_count'] / ((cust['tenure_days'] / 30.44).clip(lower=1.0))

    median_spend = cust['lifetime_spend'].median()
    cust['target'] = (cust['lifetime_spend'] > median_spend).astype(int)

    print("=== TARGET CLASS DISTRIBUTION ===", flush=True)
    print(cust['target'].value_counts(normalize=True), flush=True)

    feature_cols = [
        'customer_age', 'order_count', 'avg_order_value', 'avg_discount',
        'total_quantity', 'category_diversity', 'product_diversity',
        'recency_days', 'tenure_days', 'purchase_frequency',
        'customer_gender', 'state'
    ]
    X = pd.get_dummies(cust[feature_cols], columns=['customer_gender', 'state'], drop_first=True)
    y = cust['target']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    print("\n=== 1. HYPERPARAMETER TUNING FOR RANDOM FOREST ===", flush=True)
    param_grid = {
        'n_estimators': [50, 100],
        'max_depth': [4, 6, 8, None],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2],
        'max_features': ['sqrt', 'log2'],
        'class_weight': ['balanced', None]
    }
    rf_grid = GridSearchCV(
        RandomForestClassifier(random_state=42),
        param_grid,
        cv=cv,
        scoring='f1',
        n_jobs=1
    )
    rf_grid.fit(X_train, y_train)
    best_rf = rf_grid.best_estimator_
    print("Best RF Params:", rf_grid.best_params_, flush=True)
    print(f"Best RF CV F1: {rf_grid.best_score_:.4f}", flush=True)

    print("\n=== 2. COMPARING 4 MODELS (5-Fold Stratified CV) ===", flush=True)
    models = {
        'Logistic Regression': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'))
        ]),
        'Decision Tree': DecisionTreeClassifier(
            max_depth=5, min_samples_split=5, min_samples_leaf=2, random_state=42, class_weight='balanced'
        ),
        'Random Forest (Tuned)': best_rf,
        'Gradient Boosting': GradientBoostingClassifier(
            n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42
        )
    }

    comparison = {}
    for name, model in models.items():
        scores = cross_validate(model, X_train, y_train, cv=cv, scoring=['accuracy', 'precision', 'recall', 'f1'])
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        comparison[name] = {
            'cv_accuracy_mean': float(scores['test_accuracy'].mean()),
            'cv_accuracy_std': float(scores['test_accuracy'].std()),
            'cv_f1_mean': float(scores['test_f1'].mean()),
            'cv_f1_std': float(scores['test_f1'].std()),
            'test_accuracy': float(acc),
            'test_precision': float(prec),
            'test_recall': float(rec),
            'test_f1': float(f1),
            'confusion_matrix': cm
        }
        print(f"{name:25s} | CV Acc: {scores['test_accuracy'].mean():.4f} | CV F1: {scores['test_f1'].mean():.4f} | Test Acc: {acc:.4f} | Test Prec: {prec:.4f} | Test Rec: {rec:.4f} | Test F1: {f1:.4f}", flush=True)

    importances = best_rf.feature_importances_
    feat_names = list(X.columns)
    feat_imp = sorted(zip(feat_names, importances), key=lambda x: x[1], reverse=True)
    print("\n=== TOP FEATURES (Random Forest) ===", flush=True)
    for f, imp in feat_imp[:10]:
        print(f"{f:30s}: {imp:.4f} ({imp*100:.2f}%)", flush=True)

    gb_model = models['Gradient Boosting']
    gb_importances = gb_model.feature_importances_
    gb_feat_imp = sorted(zip(feat_names, gb_importances), key=lambda x: x[1], reverse=True)
    print("\n=== TOP FEATURES (Gradient Boosting) ===", flush=True)
    for f, imp in gb_feat_imp[:10]:
        print(f"{f:30s}: {imp:.4f} ({imp*100:.2f}%)", flush=True)

if __name__ == '__main__':
    run_experiment()
