from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class ParsedResumeResponse(BaseModel):
    """Normalized response schema for parsed resume details."""
    success: bool = True
    raw_text: str = ""
    candidate_name: str = ""
    first_name: str = ""
    last_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    headline: str = ""
    current_role: str = ""
    total_experience_years: float = 0.0
    skills: List[str] = []
    skill_set: str = ""
    linkedin_url: str = ""
    github_url: str = ""
    portfolio_url: Optional[str] = ""
    summary: str = ""

class ResumeMatchRequest(BaseModel):
    """Request payload for ATS resume fit scoring."""
    resume_text: Optional[str] = ""
    candidate_skills: Optional[List[str]] = []
    job_title: str
    department: Optional[str] = "Engineering"
    required_skills: List[str] = []
    experience_required: Optional[float] = 3.0
    job_description: Optional[str] = ""
    weights: Optional[Dict[str, float]] = Field(
        default={
            "technical": 0.40,
            "experience": 0.30,
            "certifications": 0.20,
            "location_rate": 0.10,
        }
    )

class ResumeMatchResponse(BaseModel):
    """Calculated ATS candidate match score and breakdown."""
    success: bool = True
    fit_score: int
    fit_badge: str  # 'Top Match', 'Moderate Match', 'Below Threshold'
    category: str   # 'green', 'yellow', 'gray'
    skills_match_score: int
    experience_match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    growth_areas: List[str]
    recommendation: str
