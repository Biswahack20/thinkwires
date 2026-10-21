from app.schemas.resume import ResumeMatchRequest
from app.services.match_scorer import calculate_match_score

def test_calculate_match_score_high_fit():
    req = ResumeMatchRequest(
        job_title="Lead Cloud Infrastructure & Platform Architect",
        required_skills=["Kubernetes", "Terraform", "AWS", "Go"],
        candidate_skills=["kubernetes", "terraform", "aws", "docker", "go"],
        experience_required=5.0,
        resume_text="Senior Lead Architect with 7 years of experience in Kubernetes, Terraform, AWS, and Go.",
    )
    res = calculate_match_score(req)
    assert res.success is True
    assert res.fit_score >= 80
    assert res.fit_badge == "Top Match"
    assert res.category == "green"
    assert "Kubernetes" in res.matched_skills
    assert "Terraform" in res.matched_skills
    assert len(res.strengths) > 0

def test_calculate_match_score_moderate_fit():
    req = ResumeMatchRequest(
        job_title="Senior Python Data Engineer",
        required_skills=["Python", "Snowflake", "dbt", "Airflow", "Kafka"],
        candidate_skills=["python", "sql"],
        experience_required=4.0,
        resume_text="Software engineer with 3 years experience in Python and PostgreSQL.",
    )
    res = calculate_match_score(req)
    assert res.success is True
    assert res.fit_score < 80
    assert len(res.missing_skills) > 0
