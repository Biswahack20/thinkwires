from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "ThinkWires" in data["service"]

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_parse_resume_api():
    sample_text = (
        "Alex Rivera\n"
        "alex.rivera@example.com\n"
        "+1 555-0199\n"
        "Senior Cloud Architect with 6 years experience in Kubernetes, Terraform, and AWS."
    )
    response = client.post("/api/resume/parse", data={"raw_text": sample_text})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["first_name"] == "Alex"
    assert "Kubernetes" in data["skills"]

def test_match_score_api():
    payload = {
        "job_title": "Lead DevOps Architect",
        "required_skills": ["Kubernetes", "AWS", "Terraform"],
        "candidate_skills": ["kubernetes", "aws", "terraform"],
        "experience_required": 4.0,
        "resume_text": "Architect with 6 years of experience in AWS, Kubernetes, and Terraform.",
    }
    response = client.post("/api/resume/match-score", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["fit_score"] >= 80

def test_generate_screening_test_api():
    payload = {
        "job_id": "TEST-JOB-99",
        "job_title": "Senior Backend Engineer",
        "required_skills": ["Node.js", "PostgreSQL", "Docker"],
    }
    response = client.post("/api/screening/generate-test", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["questions"]) == 10

def test_evaluate_screening_test_api():
    gen_payload = {
        "job_id": "TEST-JOB-99",
        "job_title": "Senior Backend Engineer",
        "required_skills": ["Node.js", "PostgreSQL", "Docker"],
    }
    test_data = client.post("/api/screening/generate-test", json=gen_payload).json()
    
    eval_payload = {
        "test_id": test_data["test_id"],
        "job_id": test_data["job_id"],
        "passing_threshold": 75,
        "questions": test_data["questions"],
        "candidate_answers": {
            q["id"]: q.get("correct_option_index", 0) for q in test_data["questions"] if q["type"] == "mcq"
        },
    }
    response = client.post("/api/screening/evaluate-test", json=eval_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "total_score" in data
    assert "gatekeeper_status" in data
