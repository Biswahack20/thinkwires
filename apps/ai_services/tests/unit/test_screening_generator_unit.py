from app.schemas.screening import GenerateAssessmentRequest
from app.services.test_generator import generate_screening_test

def test_generate_screening_test_10_question_structure():
    req = GenerateAssessmentRequest(
        job_id="JOB-DEV-500",
        job_title="Lead Distributed Systems Engineer",
        required_skills=["Go", "Kubernetes", "Kafka", "PostgreSQL"],
    )
    result = generate_screening_test(req)

    assert result["success"] is True
    assert result["job_id"] == "JOB-DEV-500"
    assert result["job_title"] == "Lead Distributed Systems Engineer"
    assert len(result["questions"]) == 10

    mcqs = [q for q in result["questions"] if q["type"] == "mcq"]
    scenarios = [q for q in result["questions"] if q["type"] == "scenario"]
    practicals = [q for q in result["questions"] if q["type"] == "practical"]

    assert len(mcqs) == 7
    assert len(scenarios) == 2
    assert len(practicals) == 1

def test_generate_screening_test_total_points():
    req = GenerateAssessmentRequest(
        job_id="JOB-DEV-501",
        job_title="Cloud Engineer",
        required_skills=["AWS", "Docker"],
    )
    result = generate_screening_test(req)
    total_points = sum(q["points"] for q in result["questions"])
    assert total_points == 120  # 7*10 + 2*15 + 1*20

def test_generate_screening_test_unique_ids_and_mcq_options():
    req = GenerateAssessmentRequest(
        job_id="JOB-DEV-502",
        job_title="Frontend Specialist",
        required_skills=["React", "TypeScript"],
    )
    result = generate_screening_test(req)
    ids = [q["id"] for q in result["questions"]]
    assert len(ids) == len(set(ids))  # all IDs unique

    for q in result["questions"]:
        if q["type"] == "mcq":
            assert len(q["options"]) == 4
            assert 0 <= q["correct_option_index"] < 4
            assert len(q["explanation"]) > 10

def test_generate_screening_test_default_skills_fallback():
    req = GenerateAssessmentRequest(
        job_id="JOB-DEV-503",
        job_title="Generalist Software Engineer",
        required_skills=[],  # empty
    )
    result = generate_screening_test(req)
    assert len(result["questions"]) == 10
    # Uses fallback React / TypeScript / System Design
    assert any("React" in q["question"] for q in result["questions"] if q["type"] == "mcq")
