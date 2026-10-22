def test_root_endpoint_status(client):
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "ThinkWires" in data["service"]
    assert "version" in data

def test_health_check_endpoint(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_health_endpoint_invalid_method(client):
    res = client.post("/health")
    assert res.status_code == 405  # Method Not Allowed
