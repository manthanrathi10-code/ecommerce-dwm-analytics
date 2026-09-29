import pandas as pd
from sklearn.cluster import KMeans
from mlxtend.frequent_patterns import apriori, association_rules
from app.database import engine
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

def get_classifier(selected_algorithm):
    if selected_algorithm == 'decision_tree':
        return DecisionTreeClassifier(random_state=42), "Decision Tree Classifier"
    elif selected_algorithm == 'logistic_regression':
        return make_pipeline(StandardScaler(), LogisticRegression(random_state=42, max_iter=1000)), "Logistic Regression"
    elif selected_algorithm == 'knn':
        return make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)), "K-Nearest Neighbors"
    elif selected_algorithm == 'svm':
        return make_pipeline(StandardScaler(), SVC(random_state=42)), "Support Vector Machine"
    elif selected_algorithm == 'naive_bayes':
        return GaussianNB(), "Naive Bayes Classifier"
    else:
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            max_features='sqrt',
            random_state=42
        )
        return model, "Tuned Random Forest Classifier"


def get_clusters(n_clusters: int = 3):
    query = """
        SELECT c.customer_id, SUM(f.total_amount) as total_spent, COUNT(DISTINCT f.order_id) as order_count
        FROM fact_sales f
        JOIN dim_customer c ON f.customer_key = c.customer_key
        GROUP BY c.customer_id
    """
    df = pd.read_sql(query, engine)
    
    if df.empty:
        return []
        
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(df[['total_spent', 'order_count']])
    
    return df.to_dict(orient="records")

def get_association_rules(min_support: float = 0.002):
    query = """
        SELECT f.order_id, p.category
        FROM fact_sales f
        JOIN dim_product p ON f.product_key = p.product_key
    """
    df = pd.read_sql(query, engine)
    
    if df.empty:
        return []
        
    basket = df.groupby(['order_id', 'category'])['category'].count().unstack().reset_index().fillna(0).set_index('order_id')
    basket = basket.map(lambda x: 1 if x > 0 else 0)
    basket = basket.astype(bool)
    
    freq_items = apriori(basket, min_support=min_support, use_colnames=True)
    if freq_items.empty:
        return []
        
    rules = association_rules(freq_items, metric="lift", min_threshold=1.0, num_itemsets=len(basket))
    rules['antecedents'] = rules['antecedents'].apply(list)
    rules['consequents'] = rules['consequents'].apply(list)
    return rules.head(10).to_dict(orient="records")

def get_regression():
    query = """
        SELECT quantity, unit_price, total_amount
        FROM fact_sales
    """
    df = pd.read_sql(query, engine)
    
    if df.empty:
        return {"coefficients": [], "intercept": 0.0, "r2_score": 0.0}
        
    X = df[['quantity', 'unit_price']]
    y = df['total_amount']
    
    model = LinearRegression()
    model.fit(X, y)
    score = model.score(X, y)
    
    return {
        "coefficients": model.coef_.tolist(),
        "intercept": float(model.intercept_),
        "r2_score": float(score)
    }

def get_classification(algorithm: str = 'random_forest'):
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
    
    if df.empty:
        return {"accuracy": 0.0, "feature_names": [], "feature_importances": []}
        
    df['full_date'] = pd.to_datetime(df['full_date'])
    max_date = df['full_date'].max()

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

    # Target: High-Value Customer vs At-Risk / Churn Tier
    median_spend = cust['lifetime_spend'].median()
    cust['is_high_value'] = (cust['lifetime_spend'] > median_spend).astype(int)

    # Prepare features: exclude customer identifiers, raw transaction dates, and raw lifetime_spend
    # (Excluding lifetime_spend strictly avoids data leakage of the target boundary)
    feature_cols = [
        'customer_age', 'order_count', 'avg_order_value', 'avg_discount',
        'total_quantity', 'category_diversity', 'product_diversity',
        'recency_days', 'tenure_days', 'purchase_frequency',
        'customer_gender', 'state'
    ]
    X = pd.get_dummies(cust[feature_cols], columns=['customer_gender', 'state'], drop_first=True)
    y = cust['is_high_value']

    if len(y.unique()) < 2:
        return {"accuracy": 0.0, "feature_names": list(X.columns), "feature_importances": [0.0]*len(X.columns)}

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Tuned Cross-Validation
    model, model_name = get_classifier(algorithm)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='accuracy')
    cv_score = float(cv_scores.mean())

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_.tolist()
    elif hasattr(model, 'named_steps'):
        classifier = model.named_steps[model.steps[-1][0]]
        if hasattr(classifier, 'feature_importances_'):
            importances = classifier.feature_importances_.tolist()
        elif hasattr(classifier, 'coef_'):
            importances = [abs(x) for x in classifier.coef_[0].tolist()]
        else:
            importances = [0.0] * len(X.columns)
    else:
        importances = [0.0] * len(X.columns)

    return {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "confusion_matrix": cm,
        "feature_names": list(X.columns),
        "feature_importances": importances,
        "model_name": model_name,
        "cv_score": cv_score
    }

def get_attribute_relevance():
    query = """
        SELECT 
            c.customer_key,
            MAX(c.customer_age) as customer_age,
            MAX(c.customer_gender) as gender,
            COUNT(DISTINCT f.order_id) as order_frequency,
            AVG(f.discount) as avg_discount,
            SUM(f.total_amount) as lifetime_spend
        FROM fact_sales f
        JOIN dim_customer c ON f.customer_key = c.customer_key
        GROUP BY c.customer_key
    """
    df = pd.read_sql(query, engine)
    
    if df.empty:
        return {}
        
    median_spend = df['lifetime_spend'].median()
    df['is_high_value'] = (df['lifetime_spend'] > median_spend).astype(int)
    
    df['customer_age'] = df['customer_age'].fillna(df['customer_age'].mean())
    df['avg_discount'] = df['avg_discount'].fillna(0)
    
    if 'gender' in df.columns:
        df = pd.get_dummies(df, columns=['gender'], drop_first=True)
        
    target = 'is_high_value'
    X = df.drop(columns=['customer_key', 'lifetime_spend', 'is_high_value']).fillna(0)
    y = df[target]
    
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X, y)
    
    importances = model.feature_importances_
    features = list(X.columns)
    
    results = []
    for attr, imp in zip(features, importances):
        results.append({
            "attribute_name": attr,
            "relevance_score": float(imp)
        })
        
    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    for i, res in enumerate(results):
        res["ranking"] = i + 1
        
    return {
        "target": "High Value Customer (Lifetime Spend > Median)",
        "method": "Random Forest Classifier Feature Importance",
        "relevance": results
    }
