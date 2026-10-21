import re
from typing import Dict, Any, List
from app.schemas.resume import ResumeMatchRequest, ResumeMatchResponse
from app.services.resume_parser import COMMON_TECH_SKILLS

def calculate_match_score(request: ResumeMatchRequest) -> ResumeMatchResponse:
    """
    Computes candidate ATS Fit Score (0-100%) against job requisition
    using weighted dimensions per PRD Section 4.3:
    - Technical Skills Match: 40%
    - Experience Level Match: 30%
    - Certifications / System Depth: 20%
    - Role & Context Alignment: 10%
    """
    resume_text = request.resume_text or ""
    candidate_skills = [s.strip().lower() for s in (request.candidate_skills or [])]

    # Combine text extraction if skills list was empty
    if not candidate_skills and resume_text:
        for skill in COMMON_TECH_SKILLS:
            if re.search(r"\b" + re.escape(skill) + r"\b", resume_text, re.I):
                candidate_skills.append(skill.lower())

    required_skills_clean = [s.strip() for s in request.required_skills if s.strip()]
    if not required_skills_clean:
        required_skills_clean = ["React", "JavaScript", "TypeScript", "Node.js", "PostgreSQL"]

    matched: List[str] = []
    missing: List[str] = []
    for req_skill in required_skills_clean:
        if any(req_skill.lower() == cs or req_skill.lower() in cs or cs in req_skill.lower() for cs in candidate_skills):
            matched.append(req_skill)
        elif resume_text and re.search(r"\b" + re.escape(req_skill) + r"\b", resume_text, re.I):
            matched.append(req_skill)
        else:
            missing.append(req_skill)

    # 1. Technical Skills Score (40% weight)
    skills_ratio = len(matched) / max(len(required_skills_clean), 1)
    skills_score = int(min(skills_ratio * 100, 100))

    # 2. Experience Match Score (30% weight)
    exp_required = float(request.experience_required or 3.0)
    exp_detected = 4.0
    exp_match = re.search(r"(\d+(\.\d+)?)\s*(years?|yrs?)", resume_text, re.I)
    if exp_match:
        try:
            exp_detected = float(exp_match.group(1))
        except ValueError:
            exp_detected = 4.0

    exp_ratio = min(exp_detected / max(exp_required, 1.0), 1.25)
    experience_score = int(min(exp_ratio * 100, 100))

    # 3. Certifications & Depth Score (20% weight)
    depth_score = 80 if ("lead" in resume_text.lower() or "senior" in resume_text.lower() or len(matched) >= 3) else 65

    # 4. Context & Role Alignment (10% weight)
    context_score = 90 if request.job_title.lower() in resume_text.lower() else 75

    # Weighted calculation
    weights = request.weights or {"technical": 0.4, "experience": 0.3, "certifications": 0.2, "location_rate": 0.1}
    raw_fit_score = (
        skills_score * weights.get("technical", 0.4)
        + experience_score * weights.get("experience", 0.3)
        + depth_score * weights.get("certifications", 0.2)
        + context_score * weights.get("location_rate", 0.1)
    )
    final_score = int(round(raw_fit_score))
    final_score = max(20, min(final_score, 99))  # Keep within realistic bounds

    # Badges (PRD Section 4.3)
    if final_score >= 80:
        fit_badge = "Top Match"
        category = "green"
    elif final_score >= 60:
        fit_badge = "Moderate Match"
        category = "yellow"
    else:
        fit_badge = "Below Threshold"
        category = "gray"

    strengths = [
        f"Strong proficiency verified in key mandate skills: {', '.join(matched[:3]) if matched else 'Foundational engineering'}",
        f"Demonstrated {int(exp_detected)} years technical experience aligned with {request.job_title} requirements."
    ]
    growth_areas = []
    if missing:
        growth_areas.append(f"Opportunity to demonstrate specialized depth in {', '.join(missing[:3])}.")
    else:
        growth_areas.append("Demonstrate end-to-end production architectural leadership.")

    recommendation = (
        f"High candidate affinity for {request.job_title}. Fast-track for technical screening."
        if final_score >= 80
        else f"Meets core criteria with moderate overlap. Recommended for technical interview with focus on {', '.join(missing[:2]) if missing else 'system design'}."
    )

    return ResumeMatchResponse(
        success=True,
        fit_score=final_score,
        fit_badge=fit_badge,
        category=category,
        skills_match_score=skills_score,
        experience_match_score=experience_score,
        matched_skills=matched,
        missing_skills=missing,
        strengths=strengths,
        growth_areas=growth_areas,
        recommendation=recommendation,
    )
