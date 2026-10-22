import io
import pytest
from fastapi.testclient import TestClient
from pypdf import PdfWriter

from main import app

@pytest.fixture(scope="session")
def client():
    """FastAPI TestClient fixture."""
    return TestClient(app)

@pytest.fixture
def sample_resume_text():
    """Realistic candidate resume text fixture."""
    return """
    Alex Rivera
    alex.rivera@cloudscale.io
    +1 (555) 432-8765
    San Francisco, CA
    https://linkedin.com/in/alexrivera
    https://github.com/alexrivera
    https://alexrivera.dev

    PROFESSIONAL SUMMARY
    Senior Cloud & DevOps Architect with 8+ years of enterprise experience in Kubernetes, Terraform, AWS, Docker, Python, and Go. Proven track record of scaling high-throughput distributed architectures, architecting microservices, and implementing zero-trust security postures.

    CORE SKILLS
    Kubernetes, Docker, Terraform, AWS, Python, Go, PostgreSQL, Redis, CI/CD, Microservices, REST APIs, Git, Linux

    EXPERIENCE
    Lead Infrastructure Architect | CloudScale Inc | 2021 - Present
    - Designed multi-region Kubernetes clusters on AWS serving 15M monthly active users.
    - Automated declarative infrastructure using Terraform and Helm.

    Senior DevOps Engineer | DataForge Systems | 2017 - 2021
    - Built CI/CD automation pipelines reducing deployment lead time by 65%.
    - Managed relational database scaling on PostgreSQL with connection pooling.
    """

@pytest.fixture
def create_sample_pdf():
    """Generates valid synthetic PDF bytes for upload testing."""
    def _create(pages: int = 1) -> bytes:
        writer = PdfWriter()
        for _ in range(pages):
            writer.add_blank_page(width=612, height=792)
        buf = io.BytesIO()
        writer.write(buf)
        return buf.getvalue()
    return _create

@pytest.fixture
def mock_open_requisition():
    """Standard open requisition payload for ATS matching."""
    return {
        "job_id": "REQ-CLOUD-2026",
        "job_title": "Senior Cloud Infrastructure Architect",
        "department": "Platform & Cloud",
        "required_skills": ["Kubernetes", "AWS", "Terraform", "Docker", "Python"],
        "candidate_skills": ["kubernetes", "aws", "terraform", "docker", "python", "postgresql", "redis"],
        "experience_required": 5.0,
        "job_description": "We are seeking a Senior Cloud Infrastructure Architect with 5+ years building distributed cloud native systems on AWS with Kubernetes and Terraform.",
    }
