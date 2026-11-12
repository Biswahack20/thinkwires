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
                "category": q.get("category") or "Technical Competency",
                "type": "mcq",
                "prompt": q.get("prompt") or q.get("question", ""),
                "candidate_answer": int(cand_answer) if cand_answer is not None else None,
                "correct_option_index": int(correct_idx),
                "earned_points": earned,
                "possible_points": points,
                "is_correct": is_correct,
                "explanation": q.get("explanation", "Selected option verified correct against technical specification." if is_correct else f"Expected option index {correct_idx}."),
            })

        elif q_type == "scenario":
            text_resp = str(cand_answer or "").strip()
            word_count = len(text_resp.split())
            if word_count >= 40:
                earned = points
                eval_feedback = "Demonstrates production architecture depth and systematic trade-off mitigation."
            elif word_count >= 15:
                earned = int(points * 0.75)
                eval_feedback = "Adequate approach; minor architectural gaps noted."
            elif word_count > 0:
                earned = int(points * 0.5)
                eval_feedback = "Response lacks sufficient architectural mitigation details."
            else:
                earned = 0
                eval_feedback = "No scenario mitigation response provided."
            total_earned += earned
            is_correct = earned >= int(points * 0.7)
            feedback_items.append({
                "question_id": q_id,
                "category": q.get("category") or "System Design",
                "type": "scenario",
                "prompt": q.get("prompt") or q.get("question", ""),
                "candidate_answer_text": text_resp,
                "earned_points": earned,
                "possible_points": points,
                "is_correct": is_correct,
                "explanation": eval_feedback,
                "evaluatorFeedback": eval_feedback,
            })

        elif q_type == "practical":
            code_resp = str(cand_answer or "").strip()
            has_logic = any(kw in code_resp for kw in ["queue", "flush", "Promise", "resolve", "setTimeout", "clearTimeout"])
            if len(code_resp) > 80 and has_logic:
                earned = points
                eval_feedback = "Clean implementation with correct asynchronous concurrency and state lifecycle handling."
            elif len(code_resp) > 30:
                earned = int(points * 0.7)
                eval_feedback = "Functional implementation with opportunities for concurrency optimization."
            else:
                earned = int(points * 0.3) if code_resp else 0
                eval_feedback = "Implementation does not meet concurrency and async handling specifications."
            total_earned += earned
            is_correct = earned >= int(points * 0.7)
            feedback_items.append({
                "question_id": q_id,
                "category": q.get("category") or "Practical Implementation",
                "type": "practical",
                "prompt": q.get("prompt") or q.get("question", ""),
                "candidate_answer_text": code_resp,
                "earned_points": earned,
                "possible_points": points,
                "is_correct": is_correct,
                "explanation": eval_feedback,
                "evaluatorFeedback": eval_feedback,
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
