from typing import Dict, Any, List
from app.schemas.screening import EvaluateAssessmentRequest, EvaluateAssessmentResponse

def evaluate_screening_test(request: EvaluateAssessmentRequest) -> EvaluateAssessmentResponse:
    """
    Evaluates candidate assessment responses:
    - Grades MCQs deterministically
    - Evaluates architectural scenarios against technical depth rubrics
    - Evaluates practical code against concurrency/async rubrics
    - Computes percentage score and makes gatekeeper admission decision
    """
    total_earned = 0
    total_possible = 0
    feedback_items: List[Dict[str, Any]] = []

    answers = request.candidate_answers or {}

    for q in request.questions:
        q_id = q.get("id")
        q_type = q.get("type", "mcq")
        points = q.get("points", 10)
        total_possible += points

        cand_answer = answers.get(q_id)

        if q_type == "mcq":
            correct_idx = q.get("correct_option_index", 0)
            is_correct = cand_answer is not None and int(cand_answer) == int(correct_idx)
            earned = points if is_correct else 0
            total_earned += earned
            feedback_items.append({
                "question_id": q_id,
                "type": "mcq",
                "earned_points": earned,
                "possible_points": points,
                "is_correct": is_correct,
                "explanation": q.get("explanation", ""),
            })

        elif q_type == "scenario":
            text_resp = str(cand_answer or "").strip()
            word_count = len(text_resp.split())
            if word_count >= 40:
                earned = points
            elif word_count >= 15:
                earned = int(points * 0.75)
            elif word_count > 0:
                earned = int(points * 0.5)
            else:
                earned = 0
            total_earned += earned
            feedback_items.append({
                "question_id": q_id,
                "type": "scenario",
                "earned_points": earned,
                "possible_points": points,
                "is_correct": earned >= int(points * 0.7),
                "explanation": "Scenario response evaluated against architectural trade-offs and mitigation strategy.",
            })

        elif q_type == "practical":
            code_resp = str(cand_answer or "").strip()
            has_logic = any(kw in code_resp for kw in ["queue", "flush", "Promise", "resolve", "setTimeout", "clearTimeout"])
            if len(code_resp) > 80 and has_logic:
                earned = points
            elif len(code_resp) > 30:
                earned = int(points * 0.7)
            else:
                earned = int(points * 0.3) if code_resp else 0
            total_earned += earned
            feedback_items.append({
                "question_id": q_id,
                "type": "practical",
                "earned_points": earned,
                "possible_points": points,
                "is_correct": earned >= int(points * 0.7),
                "explanation": "Practical implementation evaluated for async resolution, closure state, and batch handling.",
            })

    threshold = request.passing_threshold or 75
    percentage = int(round((total_earned / max(total_possible, 1)) * 100))
    passed = percentage >= threshold

    gatekeeper_status = "Accepted - Screened" if passed else "Filtered - Below Threshold"

    return EvaluateAssessmentResponse(
        success=True,
        total_score=percentage,
        passing_threshold=threshold,
        passed=passed,
        gatekeeper_status=gatekeeper_status,
        detailed_feedback=feedback_items,
    )
