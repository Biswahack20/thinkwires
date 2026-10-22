def test_end_to_end_qualified_candidate_ai_journey(client, sample_resume_text):
    """
    Simulates the complete recruitment candidate journey through the AI microservice:
    Step 1: Parse candidate resume
    Step 2: Calculate ATS candidate-to-requisition fit score
    Step 3: Generate proctored 10-question technical screening test
    Step 4: Candidate submits assessment responses
    Step 5: Automated evaluation, rubric grading, and gatekeeper admission decision
    """
    # ── STEP 1: PARSE RESUME ────────────────────────────────────────────────
    parse_res = client.post("/api/resume/parse", data={"raw_text": sample_resume_text})
    assert parse_res.status_code == 200
    candidate = parse_res.json()
    assert candidate["success"] is True
    assert candidate["first_name"] == "Alex"
    assert candidate["last_name"] == "Rivera"
    assert "Kubernetes" in candidate["skills"]
    assert "AWS" in candidate["skills"]
    assert candidate["total_experience_years"] >= 5.0

    # ── STEP 2: ATS FIT SCORING ─────────────────────────────────────────────
    job_req = {
        "job_id": "REQ-INFRA-800",
        "job_title": "Lead Cloud Infrastructure Architect",
        "department": "Platform Engineering",
        "required_skills": ["Kubernetes", "AWS", "Terraform", "Docker", "Python"],
        "candidate_skills": candidate["skills"],
        "experience_required": 5.0,
        "resume_text": sample_resume_text,
    }
    match_res = client.post("/api/resume/match-score", json=job_req)
    assert match_res.status_code == 200
    match_data = match_res.json()
    assert match_data["success"] is True
    assert match_data["fit_score"] >= 80
    assert match_data["fit_badge"] == "Top Match"
    assert match_data["category"] == "green"
    assert len(match_data["missing_skills"]) == 0

    # ── STEP 3: GENERATE SCREENING ASSESSMENT ───────────────────────────────
    gen_req = {
        "job_id": job_req["job_id"],
        "job_title": job_req["job_title"],
        "department": job_req["department"],
        "required_skills": job_req["required_skills"],
        "candidate_name": f"{candidate['first_name']} {candidate['last_name']}",
        "passing_threshold": 75,
    }
    test_gen_res = client.post("/api/screening/generate-test", json=gen_req)
    assert test_gen_res.status_code == 200
    test_suite = test_gen_res.json()
    assert test_suite["success"] is True
    assert len(test_suite["questions"]) == 10

    # ── STEP 4 & 5: CANDIDATE ANSWERS AND GRADING ───────────────────────────
    questions = test_suite["questions"]
    answers = {}
    for q in questions:
        if q["type"] == "mcq":
            answers[q["id"]] = q.get("correct_option_index", 0)
        elif q["type"] == "scenario":
            answers[q["id"]] = (
                "To resolve the distributed bottleneck, we introduced an asynchronous event-driven pipeline "
                "using Apache Kafka with decoupled consumers, backed by Redis write-behind caching and circuit breakers. "
                "Database contention was addressed by separating read queries to read-replicas with connection pooling."
            )
        elif q["type"] == "practical":
            answers[q["id"]] = (
                "function createBatcher(batchHandler, maxBatchSize = 10, delayMs = 50) { "
                "let queue = []; let timer = null; "
                "function flush() { if (!queue.length) return; const items = queue.splice(0, maxBatchSize); "
                "batchHandler(items.map(i => i.item)).then(res => items.forEach((i, idx) => i.resolve(res[idx])))"
                ".catch(err => items.forEach(i => i.reject(err))); } "
                "return function enqueue(item) { return new Promise((resolve, reject) => { "
                "queue.push({ item, resolve, reject }); if (queue.length >= maxBatchSize) { clearTimeout(timer); flush(); } "
                "else if (!timer) { timer = setTimeout(() => { timer = null; flush(); }, delayMs); } }); }; }"
            )

    eval_req = {
        "test_id": test_suite["test_id"],
        "job_id": job_req["job_id"],
        "passing_threshold": 75,
        "questions": questions,
        "candidate_answers": answers,
    }
    eval_res = client.post("/api/screening/evaluate-test", json=eval_req)
    assert eval_res.status_code == 200
    eval_data = eval_res.json()

    assert eval_data["success"] is True
    assert eval_data["total_score"] >= 80
    assert eval_data["passed"] is True
    assert eval_data["gatekeeper_status"] == "Accepted - Screened"
    assert len(eval_data["detailed_feedback"]) == 10

def test_underqualified_candidate_ai_journey(client):
    """
    Verifies that candidates missing core skills and failing assessments
    are cleanly identified and filtered out without exceptions.
    """
    underqualified_text = "Intern with 6 months learning basic HTML and CSS."
    parse_res = client.post("/api/resume/parse", data={"raw_text": underqualified_text})
    assert parse_res.status_code == 200

    match_res = client.post(
        "/api/resume/match-score",
        json={
            "job_title": "Principal Architect",
            "required_skills": ["Kubernetes", "AWS", "Go", "Terraform", "Distributed Systems"],
            "candidate_skills": ["html", "css"],
            "experience_required": 8.0,
            "resume_text": underqualified_text,
        },
    )
    match_data = match_res.json()
    assert match_data["fit_score"] < 60
    assert match_data["fit_badge"] == "Below Threshold"

    # Evaluates failing screening
    eval_res = client.post(
        "/api/screening/evaluate-test",
        json={
            "test_id": "TEST-FAIL-1",
            "passing_threshold": 75,
            "questions": [
                {"id": "q1", "type": "mcq", "points": 10, "correct_option_index": 2},
                {"id": "q2", "type": "mcq", "points": 10, "correct_option_index": 0},
            ],
            "candidate_answers": {"q1": 0, "q2": 1},  # both incorrect
        },
    )
    eval_data = eval_res.json()
    assert eval_data["total_score"] == 0
    assert eval_data["passed"] is False
    assert eval_data["gatekeeper_status"] == "Filtered - Below Threshold"
