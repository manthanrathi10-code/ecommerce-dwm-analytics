def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_dashboard_kpis(client):
    response = client.get("/api/dashboard/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "total_revenue" in data
    assert "total_profit" in data
    assert "total_orders" in data
    assert "total_customers" in data

def test_olap_rollup(client):
    response = client.get("/api/olap/rollup?dimension=location")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "revenue" in data[0]

def test_mining_clusters(client):
    response = client.get("/api/mining/clusters?n_clusters=3")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_mining_association_rules(client):
    response = client.get("/api/mining/association-rules?min_support=0.001")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_olap_slice_case_insensitivity(client):
    # Test Location with Mumbai
    res_title = client.get("/api/olap/slice?dimension=Location&value=Mumbai")
    assert res_title.status_code == 200
    data_title = res_title.json()
    assert len(data_title) == 1
    assert data_title[0]["location"] == "Mumbai"
    assert "revenue" in data_title[0]

    # Test lowercase, uppercase, and mixed case
    res_lower = client.get("/api/olap/slice?dimension=location&value=Mumbai")
    res_upper = client.get("/api/olap/slice?dimension=LOCATION&value=Mumbai")
    res_mixed = client.get("/api/olap/slice?dimension=LoCaTiOn&value=Mumbai")

    assert res_lower.status_code == 200
    assert res_upper.status_code == 200
    assert res_mixed.status_code == 200

    assert data_title == res_lower.json() == res_upper.json() == res_mixed.json()

    # Ensure other cities like Pune, Delhi, Bangalore do not appear
    for row in data_title:
        assert row["location"] == "Mumbai"

def test_olap_slice_invalid_dimension(client):
    response = client.get("/api/olap/slice?dimension=invalid_dimension&value=Mumbai")
    assert response.status_code == 400
    assert "Invalid dimension: invalid_dimension" in response.json().get("detail", "")

def test_olap_slice_sql_injection_protection(client):
    # Parameterized query should treat this as a literal city value and not execute SQL injection
    response = client.get("/api/olap/slice?dimension=location&value=Mumbai%27%20OR%20%271%27=%271")
    assert response.status_code == 200
    assert response.json() == []

def test_olap_dice_case_insensitivity(client):
    res1 = client.get("/api/olap/dice?dimension1=Location&value1=Mumbai&dimension2=Category&value2=Electronics")
    res2 = client.get("/api/olap/dice?dimension1=location&value1=Mumbai&dimension2=category&value2=Electronics")
    res3 = client.get("/api/olap/dice?dimension1=LOCATION&value1=Mumbai&dimension2=CATEGORY&value2=Electronics")

    assert res1.status_code == 200
    assert res1.json() == res2.json() == res3.json()
    if len(res1.json()) > 0:
        assert res1.json()[0]["location"] == "Mumbai"
        assert res1.json()[0]["category"] == "Electronics"

def test_olap_pivot_case_insensitivity(client):
    res1 = client.get("/api/olap/pivot?dimensions=Location,Time")
    res2 = client.get("/api/olap/pivot?dimensions=location,time")
    res3 = client.get("/api/olap/pivot?dimensions=LOCATION, TIME")

    assert res1.status_code == 200
    assert res1.json() == res2.json() == res3.json()
    assert len(res1.json()) > 0
    assert "location" in res1.json()[0]

