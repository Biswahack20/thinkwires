def test_generate_screening_test_api(client):
    payload = {
        "job_id": "REQ-7788",
        "job_title": "Lead Site Reliability Engineer",
        "department": "Infrastructure",
        "required_skills": ["Kubernetes", "Prometheus", "Terraform", "Go"],
    }
    res = client.post("/api/screening/generate-test", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["job_id"] == "REQ-7788"
    assert len(data["questions"]) == 10
    assert data["passing_threshold"] == 75

def test_generate_screening_test_validation_error(client):
    # Missing required job_title and job_id
    payload = {"required_skills": ["Docker"]}
    res = client.post("/api/screening/generate-test", json=payload)
    assert res.status_code == 422

def test_evaluate_screening_test_api(client):
    # Step 1: Generate a test suite
    gen_payload = {
        "job_id": "REQ-9900",
        "job_title": "Backend Architect",
        "required_skills": ["Node.js", "PostgreSQL"],
    }
    test_suite = client.post("/api/screening/generate-test", json=gen_payload).json()
    questions = test_suite["questions"]

    # Step 2: Assemble candidate answers
    answers = {}
    for q in questions:
        if q["type"] == "mcq":
            answers[q["id"]] = q.get("correct_option_index", 0)
        elif q["type"] == "scenario":
            answers[q["id"]] = "Implemented distributed caching with Redis and horizontal database connection pooling with read replicas."
        elif q["type"] == "practical":
            answers[q["id"]] = "function createBatcher(batchHandler, maxBatchSize = 10, delayMs = 50) { let queue = []; let timer = null; function flush() { if (!queue.length) return; const items = queue.splice(0, maxBatchSize); batchHandler(items.map(i => i.item)).then(res => items.forEach((i, idx) => i.resolve(res[idx]))).catch(err => items.forEach(i => i.reject(err))); } return function enqueue(item) { return new Promise((resolve, reject) => { queue.push({ item, resolve, reject }); if (queue.length >= maxBatchSize) { clearTimeout(timer); flush(); } else if (!timer) { timer = setTimeout(() => { timer = null; flush(); }, delayMs); } }); }; }"

    eval_payload = {
        "test_id": test_suite["test_id"],
        "job_id": "REQ-9900",
        "passing_threshold": 75,
        "questions": questions,
        "candidate_answers": answers,
    }
    res = client.post("/api/screening/evaluate-test", json=eval_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total_score"] >= 75
    assert data["passed"] is True
    assert data["gatekeeper_status"] == "Accepted - Screened"
    assert len(data["detailed_feedback"]) == 10

def test_evaluate_screening_test_validation_error(client):
    # Missing test_id
    payload = {"questions": []}
    res = client.post("/api/screening/evaluate-test", json=payload)
    assert res.status_code == 422
