from fastapi import APIRouter
from app.schemas.screening import (
    GenerateAssessmentRequest,
    EvaluateAssessmentRequest,
    EvaluateAssessmentResponse,
)
from app.services.test_generator import generate_screening_test
from app.services.test_evaluator import evaluate_screening_test

router = APIRouter(prefix="/api/screening", tags=["AI Screening Assessments"])

@router.post("/generate-test")
async def generate_screening_test_endpoint(request: GenerateAssessmentRequest):
    """
    Generates a proctored 10-Question Technical Assessment tailored to the
    job requisition and candidate profile per PRD Section 4.2.
    """
    return generate_screening_test(request)

@router.post("/evaluate-test", response_model=EvaluateAssessmentResponse)
async def evaluate_screening_test_endpoint(request: EvaluateAssessmentRequest):
    """
    Evaluates candidate assessment responses, grades MCQs deterministically,
    evaluates scenarios & code, and renders gatekeeper admission decision.
    """
    return evaluate_screening_test(request)
