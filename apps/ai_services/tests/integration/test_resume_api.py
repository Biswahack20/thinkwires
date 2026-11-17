import io
from app.config import settings

def test_parse_resume_api_with_raw_text(client, sample_resume_text):
    res = client.post("/api/resume/parse", data={"raw_text": sample_resume_text})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["first_name"] == "Alex"
    assert data["last_name"] == "Rivera"
    assert "alex.rivera@cloudscale.io" in data["email"]
    assert "Kubernetes" in data["skills"]
    assert "AWS" in data["skills"]
    assert data["total_experience_years"] >= 5.0

def test_parse_resume_api_with_pdf_upload(client, create_sample_pdf):
    pdf_bytes = create_sample_pdf(pages=2)
    files = {"file": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    res = client.post("/api/resume/parse", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "candidate_name" in data

def test_parse_resume_api_rejects_invalid_file_signature(client):
    """SEC-01: Verifies file signature enforcement against extension spoofing."""
    fake_pdf = b"NOT_A_REAL_PDF_HEADER_THIS_IS_CORRUPT"
    files = {"file": ("malicious.pdf", io.BytesIO(fake_pdf), "application/pdf")}
    res = client.post("/api/resume/parse", files=files)
    assert res.status_code == 400
    assert "Invalid file signature" in res.json()["detail"]

def test_parse_resume_api_rejects_oversized_file(client):
    """SEC-01: Verifies 10MB upload limit."""
    oversized = b"%PDF-" + b"0" * (11 * 1024 * 1024)
    files = {"file": ("huge.pdf", io.BytesIO(oversized), "application/pdf")}
    res = client.post("/api/resume/parse", files=files)
    assert res.status_code == 413
    assert "exceeds maximum limit" in res.json()["detail"]

def test_match_score_api_success(client, mock_open_requisition):
    res = client.post("/api/resume/match-score", json=mock_open_requisition)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["fit_score"] >= 80
    assert data["fit_badge"] == "Top Match"
    assert data["category"] == "green"
    assert "Kubernetes" in data["matched_skills"]
    assert "AWS" in data["matched_skills"]
    assert len(data["strengths"]) > 0

def test_match_score_api_validation_error_missing_title(client):
    payload = {
        "required_skills": ["Go", "Kubernetes"],
    }
    res = client.post("/api/resume/match-score", json=payload)
    assert res.status_code == 422
    error_detail = res.json()["detail"]
    assert any("job_title" in str(err) for err in error_detail)
