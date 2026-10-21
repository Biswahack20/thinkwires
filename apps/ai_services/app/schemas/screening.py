from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class MCQQuestion(BaseModel):
    """Multiple Choice Question schema with explanation and points."""
    id: str
    type: str = "mcq"
    question: str
    options: List[str]
    correct_option_index: int
    points: int = 10
    explanation: str

class ScenarioQuestion(BaseModel):
    """Architecture / System design trade-off scenario question."""
    id: str
    type: str = "scenario"
    scenario: str
    question: str
    rubric: str
    points: int = 15

class PracticalQuestion(BaseModel):
    """Hands-on coding or practical implementation question."""
    id: str
    type: str = "practical"
    title: str
    instructions: str
    starter_code: str
    solution_rubric: str
    points: int = 20

class GenerateAssessmentRequest(BaseModel):
    """Requisition criteria for dynamic screening test generation."""
    job_id: str
    job_title: str
    department: Optional[str] = "Engineering"
    required_skills: List[str] = []
    experience_tier: Optional[str] = "Mid"
    candidate_name: Optional[str] = ""
    candidate_skills: Optional[List[str]] = []
    job_description: Optional[str] = ""
    passing_threshold: Optional[int] = 75
    time_limit_minutes: Optional[int] = 20

class AssessmentTest(BaseModel):
    """Generated assessment payload with full question suite."""
    test_id: str
    job_id: str
    job_title: str
    passing_threshold: int
    time_limit_minutes: int
    total_points: int
    questions: List[Dict[str, Any]]

class EvaluateAssessmentRequest(BaseModel):
    """Candidate assessment submission for automated grading."""
    test_id: str
    job_id: Optional[str] = ""
    passing_threshold: Optional[int] = 75
    questions: List[Dict[str, Any]]
    candidate_answers: Dict[str, Any]

class EvaluateAssessmentResponse(BaseModel):
    """Assessment evaluation score, feedback, and admission gatekeeper decision."""
    success: bool = True
    total_score: int
    passing_threshold: int
    passed: bool
    gatekeeper_status: str  # 'Accepted - Screened' or 'Filtered - Below Threshold'
    detailed_feedback: List[Dict[str, Any]]
