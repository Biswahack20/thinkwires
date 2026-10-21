from app.schemas.screening import (
    GenerateAssessmentRequest,
    EvaluateAssessmentRequest,
)
from app.services.test_generator import generate_screening_test
from app.services.test_evaluator import evaluate_screening_test

def test_generate_screening_test():
    req = GenerateAssessmentRequest(
        job_id="JOB-101",
        job_title="Lead Distributed Systems Engineer",
        department="Systems & Distributed",
        required_skills=["Go", "Kubernetes", "Kafka", "PostgreSQL"],
    )
    test_suite = generate_screening_test(req)
    assert test_suite["success"] is True
    assert len(test_suite["questions"]) == 10
    
    # 7 MCQs, 2 Scenarios, 1 Practical
    mcqs = [q for q in test_suite["questions"] if q["type"] == "mcq"]
    scenarios = [q for q in test_suite["questions"] if q["type"] == "scenario"]
    practicals = [q for q in test_suite["questions"] if q["type"] == "practical"]
    assert len(mcqs) == 7
    assert len(scenarios) == 2
    assert len(practicals) == 1

def test_evaluate_screening_test_passing():
    req_gen = GenerateAssessmentRequest(
        job_id="JOB-102",
        job_title="Senior Frontend Engineer",
        required_skills=["React", "TypeScript"],
    )
    test_suite = generate_screening_test(req_gen)
    
    # Correct answers
    answers = {}
    for q in test_suite["questions"]:
        if q["type"] == "mcq":
            answers[q["id"]] = q["correct_option_index"]
        elif q["type"] == "scenario":
            answers[q["id"]] = "Mitigated bottleneck with asynchronous queue workers using Redis BullMQ and decoupled database writes with connection pooling."
        elif q["type"] == "practical":
            answers[q["id"]] = "function createBatcher(batchHandler, maxBatchSize = 10, delayMs = 50) { let queue = []; let timer = null; function flush() { if (!queue.length) return; const items = queue.splice(0, maxBatchSize); batchHandler(items.map(i => i.item)).then(res => items.forEach((i, idx) => i.resolve(res[idx]))).catch(err => items.forEach(i => i.reject(err))); } return function enqueue(item) { return new Promise((resolve, reject) => { queue.push({ item, resolve, reject }); if (queue.length >= maxBatchSize) { clearTimeout(timer); flush(); } else if (!timer) { timer = setTimeout(() => { timer = null; flush(); }, delayMs); } }); }; }"
            
    eval_req = EvaluateAssessmentRequest(
        test_id=test_suite["test_id"],
        passing_threshold=75,
        questions=test_suite["questions"],
        candidate_answers=answers,
    )
    result = evaluate_screening_test(eval_req)
    assert result.success is True
    assert result.passed is True
    assert result.total_score >= 75
    assert result.gatekeeper_status == "Accepted - Screened"
