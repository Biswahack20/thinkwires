from app.schemas.screening import (
    GenerateAssessmentRequest,
    EvaluateAssessmentRequest,
)
from app.services.test_generator import generate_screening_test
from app.services.test_evaluator import evaluate_screening_test

def get_test_suite():
    req = GenerateAssessmentRequest(
        job_id="TEST-JOB-EVAL",
        job_title="Full Stack Cloud Architect",
        required_skills=["React", "TypeScript", "Node.js"],
    )
    return generate_screening_test(req)

def test_evaluate_screening_test_full_marks_accepted():
    suite = get_test_suite()
    questions = suite["questions"]

    # Provide all correct answers
    answers = {}
    for q in questions:
        if q["type"] == "mcq":
            answers[q["id"]] = q["correct_option_index"]
        elif q["type"] == "scenario":
            answers[q["id"]] = "We mitigated database saturation by implementing an asynchronous write-behind buffer with Redis BullMQ and horizontal worker scaling across two availability zones."
        elif q["type"] == "practical":
            answers[q["id"]] = "function createBatcher(batchHandler, maxBatchSize = 10, delayMs = 50) { let queue = []; let timer = null; function flush() { if (!queue.length) return; const items = queue.splice(0, maxBatchSize); batchHandler(items.map(i => i.item)).then(res => items.forEach((i, idx) => i.resolve(res[idx]))).catch(err => items.forEach(i => i.reject(err))); } return function enqueue(item) { return new Promise((resolve, reject) => { queue.push({ item, resolve, reject }); if (queue.length >= maxBatchSize) { clearTimeout(timer); flush(); } else if (!timer) { timer = setTimeout(() => { timer = null; flush(); }, delayMs); } }); }; }"

    eval_req = EvaluateAssessmentRequest(
        test_id=suite["test_id"],
        passing_threshold=75,
        questions=questions,
        candidate_answers=answers,
    )
    res = evaluate_screening_test(eval_req)

    assert res.success is True
    assert res.total_score >= 85
    assert res.passed is True
    assert res.gatekeeper_status == "Accepted - Screened"
    assert len(res.detailed_feedback) == 10

def test_evaluate_screening_test_zero_marks_filtered():
    suite = get_test_suite()
    questions = suite["questions"]

    # Provide completely wrong / empty answers
    answers = {}
    for q in questions:
        if q["type"] == "mcq":
            answers[q["id"]] = (q["correct_option_index"] + 1) % 4
        elif q["type"] in ["scenario", "practical"]:
            answers[q["id"]] = ""

    eval_req = EvaluateAssessmentRequest(
        test_id=suite["test_id"],
        passing_threshold=75,
        questions=questions,
        candidate_answers=answers,
    )
    res = evaluate_screening_test(eval_req)

    assert res.success is True
    assert res.total_score == 0
    assert res.passed is False
    assert res.gatekeeper_status == "Filtered - Below Threshold"

def test_evaluate_scenario_depth_scoring():
    suite = get_test_suite()
    scenario_q = [q for q in suite["questions"] if q["type"] == "scenario"][:1]

    # Test short answer (< 15 words)
    req_short = EvaluateAssessmentRequest(
        test_id=suite["test_id"],
        questions=scenario_q,
        candidate_answers={scenario_q[0]["id"]: "Used redis cache."},
    )
    res_short = evaluate_screening_test(req_short)
    # 50% of 15 points = 7
    assert res_short.detailed_feedback[0]["earned_points"] == 7

    # Test comprehensive answer (> 40 words)
    comprehensive_text = (
        "In this scenario we isolated high-traffic read operations using a Redis read-through cache with a 60-second TTL. "
        "Write spikes were queued via RabbitMQ message brokers with exponential backoff retry policies, and worker nodes "
        "processed database batches during off-peak windows to ensure complete fault tolerance and zero data loss under load."
    )
    req_long = EvaluateAssessmentRequest(
        test_id=suite["test_id"],
        questions=scenario_q,
        candidate_answers={scenario_q[0]["id"]: comprehensive_text},
    )
    res_long = evaluate_screening_test(req_long)
    assert res_long.detailed_feedback[0]["earned_points"] == scenario_q[0]["points"]

def test_evaluate_custom_passing_threshold():
    suite = get_test_suite()
    mcq_only = [q for q in suite["questions"] if q["type"] == "mcq"][:3]
    answers = {q["id"]: q["correct_option_index"] for q in mcq_only}

    # Threshold set to 50
    req_low = EvaluateAssessmentRequest(
        test_id=suite["test_id"],
        passing_threshold=50,
        questions=mcq_only,
        candidate_answers=answers,
    )
    res_low = evaluate_screening_test(req_low)
    assert res_low.passed is True
    assert res_low.gatekeeper_status == "Accepted - Screened"
