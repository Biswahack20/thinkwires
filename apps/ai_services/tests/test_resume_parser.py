import pytest
from app.services.resume_parser import heuristic_parse_resume, parse_resume_content

def test_heuristic_parse_resume():
    sample_text = """
    Elena Rostova
    elena.rostova@cloudscale.io
    +1 (555) 432-8765
    https://linkedin.com/in/elenarostova
    https://github.com/elenarostova
    Senior Cloud & DevOps Architect with 8+ years experience in Kubernetes, Terraform, AWS, Docker, Python, and Go.
    """
    parsed = heuristic_parse_resume(sample_text)
    assert parsed["candidate_name"] == "Elena Rostova"
    assert parsed["first_name"] == "Elena"
    assert parsed["last_name"] == "Rostova"
    assert parsed["email"] == "elena.rostova@cloudscale.io"
    assert parsed["phone"] == "+1 (555) 432-8765"
    assert parsed["total_experience_years"] == 8.0
    assert "Kubernetes" in parsed["skills"]
    assert "Terraform" in parsed["skills"]
    assert "AWS" in parsed["skills"]

@pytest.mark.anyio
async def test_parse_resume_content_raw_text():
    sample_text = "Jordan Lee\njordan.lee@dev.com\n5 years of experience in React, TypeScript, Node.js, and PostgreSQL."
    result = await parse_resume_content(raw_text=sample_text)
    assert result["first_name"] == "Jordan"
    assert result["email"] == "jordan.lee@dev.com"
    assert "React" in result["skills"]
    assert "TypeScript" in result["skills"]
