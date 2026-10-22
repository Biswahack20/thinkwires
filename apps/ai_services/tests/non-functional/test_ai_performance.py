import time
from app.services.resume_parser import heuristic_parse_resume
from app.services.match_scorer import calculate_match_score
from app.schemas.resume import ResumeMatchRequest

def test_latency_sla_heuristic_parsing(sample_resume_text):
    start = time.perf_counter()
    res = heuristic_parse_resume(sample_resume_text)
    duration_ms = (time.perf_counter() - start) * 1000

    assert res["first_name"] == "Alex"
    # SLA: Heuristic parsing must complete well under 50ms
    assert duration_ms < 50, f"Heuristic parsing took {duration_ms:.2f}ms (SLA: <50ms)"

def test_latency_sla_match_scoring():
    req = ResumeMatchRequest(
        job_title="Lead Architect",
        required_skills=["Kubernetes", "AWS", "Terraform", "Go"],
        candidate_skills=["kubernetes", "aws", "terraform", "go"],
        experience_required=5.0,
        resume_text="Senior Architect with 8 years of AWS and Kubernetes.",
    )

    start = time.perf_counter()
    res = calculate_match_score(req)
    duration_ms = (time.perf_counter() - start) * 1000

    assert res.success is True
    # SLA: Rule-based scoring must complete under 15ms
    assert duration_ms < 15, f"Match scoring took {duration_ms:.2f}ms (SLA: <15ms)"

def test_latency_sla_api_health_check(client):
    start = time.perf_counter()
    res = client.get("/health")
    duration_ms = (time.perf_counter() - start) * 1000

    assert res.status_code == 200
    # SLA: /health probe must respond under 20ms
    assert duration_ms < 20, f"Health check took {duration_ms:.2f}ms (SLA: <20ms)"

def test_concurrent_burst_throughput(client):
    eval_payload = {
        "test_id": "PERF-BURST-TEST",
        "passing_threshold": 75,
        "questions": [
            {"id": f"q{i}", "type": "mcq", "points": 10, "correct_option_index": 1}
            for i in range(10)
        ],
        "candidate_answers": {f"q{i}": 1 for i in range(10)},
    }

    start = time.perf_counter()
    burst_count = 25
    for _ in range(burst_count):
        res = client.post("/api/screening/evaluate-test", json=eval_payload)
        assert res.status_code == 200

    total_duration_ms = (time.perf_counter() - start) * 1000
    avg_per_request_ms = total_duration_ms / burst_count

    # SLA: Average evaluation under burst conditions must be < 20ms
    assert avg_per_request_ms < 20, f"Average request latency was {avg_per_request_ms:.2f}ms"
