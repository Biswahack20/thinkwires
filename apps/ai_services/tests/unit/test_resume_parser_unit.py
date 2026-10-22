import pytest
from app.services.resume_parser import (
    heuristic_parse_resume,
    extract_summary_from_text,
    parse_resume_content,
    COMMON_TECH_SKILLS,
)

def test_heuristic_name_and_contact_extraction():
    text = """
    Marcus Vance
    marcus.vance@engineering.org
    (555) 789-1234
    Senior Backend Architect
    """
    res = heuristic_parse_resume(text)
    assert res["candidate_name"] == "Marcus Vance"
    assert res["first_name"] == "Marcus"
    assert res["last_name"] == "Vance"
    assert res["email"] == "marcus.vance@engineering.org"
    assert res["phone"] == "(555) 789-1234"

def test_social_links_extraction_from_text_and_annotations():
    text = """
    Sarah Chen
    sarah.chen@dev.io
    https://linkedin.com/in/sarahchen
    https://github.com/sarahchen
    https://sarahchen.dev
    Full Stack Developer
    """
    # Test extraction from text
    res = heuristic_parse_resume(text)
    assert "linkedin.com/in/sarahchen" in res["linkedin_url"]
    assert "github.com/sarahchen" in res["github_url"]

    # Test extraction priority from annotation links
    annot_links = [
        "https://linkedin.com/in/sarahchen-annotated",
        "https://github.com/sarahchen-repo",
        "https://myportfolio.vercel.app",
    ]
    res_annot = heuristic_parse_resume(text, links=annot_links)
    assert res_annot["linkedin_url"] == "https://linkedin.com/in/sarahchen-annotated"
    assert res_annot["github_url"] == "https://github.com/sarahchen-repo"
    assert res_annot["portfolio_url"] == "https://myportfolio.vercel.app"

def test_skills_extraction_canonical_mapping():
    text = "Proficient in Python, Docker, Kubernetes, AWS, PostgreSQL, Redis, and React."
    res = heuristic_parse_resume(text)
    skills = res["skills"]
    assert "Python" in skills
    assert "Docker" in skills
    assert "Kubernetes" in skills
    assert "AWS" in skills
    assert "PostgreSQL" in skills
    assert "Redis" in skills
    assert "React" in skills

def test_experience_years_extraction():
    # Explicit years with +
    res1 = heuristic_parse_resume("Staff Engineer with 10+ years experience in Go")
    assert res1["total_experience_years"] == 10.0

    # Explicit years with abbreviation "yrs"
    res2 = heuristic_parse_resume("Software Developer with 4 yrs experience")
    assert res2["total_experience_years"] == 4.0

    # Heuristic based on "senior / architect" keyword
    res3 = heuristic_parse_resume("Senior Systems Architect with experience in cloud")
    assert res3["total_experience_years"] == 5.0

    # Heuristic based on "intern / fresher" keyword
    res4 = heuristic_parse_resume("Engineering Intern at Startup")
    assert res4["total_experience_years"] == 1.0

def test_summary_extraction():
    text = """
    PROFESSIONAL SUMMARY
    Dynamic full-stack software engineer with a track record of architecting scalable cloud solutions.
    CORE SKILLS
    React, Node.js
    """
    summary = extract_summary_from_text(text)
    assert "Dynamic full-stack software engineer" in summary

def test_graceful_empty_and_minimal_text_handling():
    res = heuristic_parse_resume("")
    assert res["candidate_name"] == "Applicant"
    assert res["first_name"] == "Applicant"
    assert res["email"] == ""
    assert res["phone"] == ""
    assert isinstance(res["skills"], list)
    assert res["total_experience_years"] >= 0.0

@pytest.mark.anyio
async def test_async_parse_resume_content_raw_text():
    raw = "Jessica Alba\njessica.alba@cloud.com\n6 years experience in AWS, Terraform, Docker"
    result = await parse_resume_content(raw_text=raw)
    assert result["first_name"] == "Jessica"
    assert result["email"] == "jessica.alba@cloud.com"
    assert "AWS" in result["skills"]
    assert "Terraform" in result["skills"]
    assert result["total_experience_years"] == 6.0
