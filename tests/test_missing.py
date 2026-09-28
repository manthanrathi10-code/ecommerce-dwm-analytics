def test_dashboard_sales_trend(client):
    assert client.get("/api/dashboard/sales-trend").status_code == 200

def test_dashboard_category_sales(client):
    assert client.get("/api/dashboard/category-sales").status_code == 200

def test_dashboard_top_products(client):
    assert client.get("/api/dashboard/top-products").status_code == 200

def test_dashboard_top_customers(client):
    assert client.get("/api/dashboard/top-customers").status_code == 200

def test_dashboard_location_sales(client):
    assert client.get("/api/dashboard/location-sales").status_code == 200

def test_product_analytics(client):
    assert client.get("/api/products/analytics").status_code == 200

def test_customer_analytics(client):
    assert client.get("/api/customers/analytics").status_code == 200

def test_olap_drilldown(client):
    assert client.get("/api/olap/drilldown").status_code == 200

def test_olap_slice(client):
    assert client.get("/api/olap/slice").status_code == 200

def test_olap_dice(client):
    assert client.get("/api/olap/dice").status_code == 200

def test_olap_pivot(client):
    assert client.get("/api/olap/pivot").status_code == 200

def test_mining_classification(client):
    assert client.get("/api/mining/classification").status_code == 200

def test_mining_regression(client):
    assert client.get("/api/mining/regression").status_code == 200

def test_mining_attribute_relevance(client):
    assert client.get("/api/mining/attribute-relevance").status_code == 200

def test_etl_validation(client):
    assert client.get("/api/etl/validate").status_code == 200
