from app.schemas.resume import ResumeMatchRequest
from app.services.match_scorer import calculate_match_score

def test_match_scorer_top_match_high_alignment():
    req = ResumeMatchRequest(
        job_title="Lead Cloud Infrastructure Architect",
        required_skills=["Kubernetes", "AWS", "Terraform", "Go"],
        candidate_skills=["kubernetes", "aws", "terraform", "go", "docker", "python"],
        experience_required=5.0,
        resume_text="Senior Lead Cloud Infrastructure Architect with 8 years of experience in AWS, Kubernetes, Terraform, and Go.",
    )
    res = calculate_match_score(req)
    assert res.success is True
    assert res.fit_score >= 80
    assert res.fit_badge == "Top Match"
    assert res.category == "green"
    assert "Kubernetes" in res.matched_skills
    assert "Terraform" in res.matched_skills
    assert len(res.missing_skills) == 0
    assert "Fast-track" in res.recommendation

def test_match_scorer_moderate_match():
    req = ResumeMatchRequest(
        job_title="Senior Full Stack Engineer",
        required_skills=["React", "TypeScript", "Node.js", "PostgreSQL", "Kafka"],
        candidate_skills=["react", "typescript", "node.js"],
        experience_required=4.0,
        resume_text="Frontend Developer with 3 years experience building UI with React, TypeScript, and Node.js.",
    )
    res = calculate_match_score(req)
    assert res.success is True
    assert 60 <= res.fit_score < 80
    assert res.fit_badge == "Moderate Match"
    assert res.category == "yellow"
    assert "PostgreSQL" in res.missing_skills
    assert "Kafka" in res.missing_skills

def test_match_scorer_below_threshold():
    req = ResumeMatchRequest(
        job_title="Principal Quantum Cryptographer",
        required_skills=["Quantum Algorithms", "Post-Quantum Crypto", "Lattice Theory", "Assembly"],
        candidate_skills=["html", "css"],
        experience_required=10.0,
        resume_text="Junior Web Intern with 1 year experience in HTML.",
    )
    res = calculate_match_score(req)
    assert res.success is True
    assert res.fit_score < 60
    assert res.fit_badge == "Below Threshold"
    assert res.category == "gray"
    assert len(res.missing_skills) >= 3

def test_match_scorer_custom_weights():
    # If technical weight is 1.0 and candidate matches all skills, score should be very high
    req = ResumeMatchRequest(
        job_title="Python Developer",
        required_skills=["Python", "FastAPI"],
        candidate_skills=["python", "fastapi"],
        experience_required=3.0,
        resume_text="Python Developer with 3 years experience in FastAPI.",
        weights={"technical": 0.70, "experience": 0.10, "certifications": 0.10, "location_rate": 0.10},
    )
    res = calculate_match_score(req)
    assert res.success is True
    assert res.fit_score >= 85

def test_missing_and_matched_skills_tracking():
    req = ResumeMatchRequest(
        job_title="Backend Developer",
        required_skills=["Go", "Docker", "Redis", "gRPC"],
        candidate_skills=["go", "docker"],
        experience_required=3.0,
        resume_text="Developer with Go and Docker.",
    )
    res = calculate_match_score(req)
    assert "Go" in res.matched_skills
    assert "Docker" in res.matched_skills
    assert "Redis" in res.missing_skills
    assert "gRPC" in res.missing_skills

def test_match_scorer_empty_candidate_skills_fallback_to_text():
    req = ResumeMatchRequest(
        job_title="DevOps Engineer",
        required_skills=["Kubernetes", "Docker", "AWS"],
        candidate_skills=[],  # empty array
        experience_required=4.0,
        resume_text="Experience across Kubernetes, Docker, and AWS systems for 5 years.",
    )
    res = calculate_match_score(req)
    assert "Kubernetes" in res.matched_skills
    assert "Docker" in res.matched_skills
    assert "AWS" in res.matched_skills
    assert len(res.missing_skills) == 0
