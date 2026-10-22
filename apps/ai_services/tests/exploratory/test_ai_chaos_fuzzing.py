import io
import os
from app.schemas.resume import ResumeMatchRequest
from app.services.match_scorer import calculate_match_score

def test_corrupted_pdf_stream_graceful_handling(client):
    """
    Random binary bytes mimicking corrupted or truncated PDF streams.
    The service must catch pypdf errors and return a clean response without crashing.
    """
    corrupted_bytes = os.urandom(1024)  # 1KB of pure noise
    files = {"file": ("corrupt.pdf", io.BytesIO(corrupted_bytes), "application/pdf")}
    res = client.post("/api/resume/parse", files=files)

    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "candidate_name" in data

def test_zero_byte_pdf_stream(client):
    """
    Zero-byte uploaded file.
    """
    empty_bytes = b""
    files = {"file": ("empty.pdf", io.BytesIO(empty_bytes), "application/pdf")}
    res = client.post("/api/resume/parse", files=files)

    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True

def test_unicode_chaos_and_emojis(client):
    """
    Fuzzing with unicode zero-width spaces, RTL overrides, and emojis.
    """
    unicode_bomb = (
        "\u200B\u200C\u200D\uFEFF\u202E"  # zero width + RTL override
        "🚀🔥💻 Senior Cloud Architect 💻🔥🚀\n"
        "alex@cloud.io\n"
        "Experience in Kubernetes and AWS."
    )
    res = client.post("/api/resume/parse", data={"raw_text": unicode_bomb})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Kubernetes" in data["skills"]
    assert "AWS" in data["skills"]

def test_extreme_skill_vectors():
    """
    Massive required skills array (1,000 skills) to verify algorithmic scaling.
    """
    massive_skills = [f"Skill_{i}" for i in range(1000)]
    req = ResumeMatchRequest(
        job_title="Polymath Engineer",
        required_skills=massive_skills,
        candidate_skills=["Skill_1", "Skill_2", "Skill_3"],
        experience_required=5.0,
        resume_text="Experience in Skill_1 and Skill_2.",
    )
    res = calculate_match_score(req)
    assert res.success is True
    assert len(res.missing_skills) > 500
    assert 20 <= res.fit_score <= 100

def test_out_of_range_and_negative_experience():
    """
    Boundary condition: negative required experience or zero required experience.
    """
    req = ResumeMatchRequest(
        job_title="Junior Developer",
        required_skills=["Python"],
        candidate_skills=["python"],
        experience_required=-5.0,
        resume_text="Developer with 2 years of Python.",
    )
    res = calculate_match_score(req)
    assert res.success is True
    assert 20 <= res.fit_score <= 100

def test_unmatched_question_ids_in_evaluation(client):
    """
    Fuzzing evaluation payload where candidate answers question IDs that do not exist.
    """
    eval_payload = {
        "test_id": "CHAOS-IDS-TEST",
        "passing_threshold": 75,
        "questions": [
            {"id": "q1", "type": "mcq", "points": 10, "correct_option_index": 2}
        ],
        "candidate_answers": {
            "non_existent_id_999": 2,
            "another_fake_id": "Random text string",
            "q1": 2,
        },
    }
    res = client.post("/api/screening/evaluate-test", json=eval_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total_score"] == 100
    assert data["passed"] is True
