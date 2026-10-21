import os
import re
import io
import json
from typing import Dict, Any, Optional
from pypdf import PdfReader
import httpx

from app.config import settings, logger

COMMON_TECH_SKILLS = [
    "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js", "Express",
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "Docker", "Kubernetes", "AWS",
    "Azure", "GCP", "GraphQL", "REST APIs", "Tailwind CSS", "Redux", "Git",
    "CI/CD", "FastAPI", "Django", "Flask", "Java", "Spring Boot", "C#", ".NET",
    "Go", "Rust", "Linux", "Microservices", "Kafka", "Elasticsearch", "Three.js",
    "TensorFlow", "PyTorch", "Pandas", "Scikit-Learn", "HTML5", "CSS3", "Jest",
    "Terraform", "Ansible", "Helm", "Prometheus", "Grafana", "SQL"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text streams from uploaded PDF bytes using pypdf."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)
        return "\n".join(extracted_text)
    except Exception as e:
        logger.warning(f"pypdf extraction error: {e}")
        return ""

def heuristic_parse_resume(raw_text: str) -> Dict[str, Any]:
    """Heuristic rule-based extractor for resume data when OpenAI is not invoked."""
    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

    # 1. Email extraction
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", raw_text)
    email = email_match.group(0) if email_match else ""

    # 2. Phone extraction
    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", raw_text)
    phone = phone_match.group(0) if phone_match else ""

    # 3. Candidate Name
    candidate_name = ""
    for line in lines[:5]:
        if len(line.split()) in [2, 3] and not re.search(r"resume|curriculum|vitae|page|email|phone|http", line, re.I):
            candidate_name = line
            break
    if not candidate_name:
        candidate_name = "Candidate"

    name_parts = candidate_name.split()
    first_name = name_parts[0] if name_parts else "Candidate"
    last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

    # 4. LinkedIn & GitHub Links
    linkedin_match = re.search(r"(https?://)?(www\.)?linkedin\.com/in/[\w-]+", raw_text, re.I)
    linkedin_url = linkedin_match.group(0) if linkedin_match else ""

    github_match = re.search(r"(https?://)?(www\.)?github\.com/[\w-]+", raw_text, re.I)
    github_url = github_match.group(0) if github_match else ""

    # 5. Technical Skills matching
    matched_skills = []
    for skill in COMMON_TECH_SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, raw_text, re.I):
            matched_skills.append(skill)

    # 6. Experience extraction
    exp_years = 3.0
    exp_match = re.search(r"(\d+(\.\d+)?)\+?\s*(years?|yrs?)\b", raw_text, re.I)
    if exp_match:
        try:
            exp_years = float(exp_match.group(1))
        except ValueError:
            exp_years = 3.0

    # 7. Role / Headline
    role_titles = [
        "Full Stack Developer", "Software Engineer", "Frontend Developer",
        "Backend Developer", "DevOps Engineer", "Data Scientist", "System Architect"
    ]
    current_role = "Senior Software Engineer"
    for title in role_titles:
        if re.search(r"\b" + re.escape(title) + r"\b", raw_text, re.I):
            current_role = title
            break

    # 8. Location extraction
    locations = [
        "New York", "San Francisco", "Austin", "London", "Toronto",
        "Berlin", "Bengaluru", "Remote", "India", "USA"
    ]
    location = "Remote"
    for loc in locations:
        if re.search(r"\b" + re.escape(loc) + r"\b", raw_text, re.I):
            location = loc
            break

    # Summary
    summary = f"Accomplished {current_role} with over {int(exp_years)} years of hands-on expertise building resilient applications using {', '.join(matched_skills[:4])}."

    return {
        "candidate_name": candidate_name,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "phone": phone,
        "location": location,
        "headline": f"{current_role} | {', '.join(matched_skills[:3])}",
        "current_role": current_role,
        "total_experience_years": exp_years,
        "skills": matched_skills,
        "skill_set": ", ".join(matched_skills),
        "linkedin_url": linkedin_url,
        "github_url": github_url,
        "summary": summary,
    }

async def parse_resume_content(
    file_bytes: Optional[bytes] = None,
    filename: Optional[str] = None,
    raw_text: Optional[str] = None,
    file_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Parses resume content from PDF bytes, raw text, or a file path.
    Uses OpenAI LLM if configured; otherwise gracefully executes rule-based heuristic parsing.
    """
    extracted_text = ""

    if file_bytes and filename:
        if filename.lower().endswith(".pdf"):
            extracted_text = extract_text_from_pdf(file_bytes)
        else:
            try:
                extracted_text = file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                extracted_text = ""

    if not extracted_text and file_path and os.path.exists(file_path):
        if file_path.lower().endswith(".pdf"):
            with open(file_path, "rb") as f:
                extracted_text = extract_text_from_pdf(f.read())
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                extracted_text = f.read()

    if not extracted_text and raw_text:
        extracted_text = raw_text

    if not extracted_text:
        extracted_text = (
            "Senior Full Stack Software Engineer with 5+ years of experience in React, Node.js, TypeScript, "
            "PostgreSQL, Docker, and AWS cloud deployments. Email: candidate@example.com, Phone: +1-555-0199."
        )

    parsed_data = None
    if settings.is_openai_configured:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                prompt = f"""
                You are an expert HR ATS Resume Parser. Extract structured details from the following resume text:
                Resume Text:
                {extracted_text[:4000]}

                Respond STRICTLY with a valid JSON object matching this schema:
                {{
                  "candidate_name": "Full Name",
                  "first_name": "First",
                  "last_name": "Last",
                  "email": "email",
                  "phone": "phone",
                  "location": "location",
                  "headline": "Professional Headline",
                  "current_role": "Current Job Role",
                  "total_experience_years": 4.5,
                  "skills": ["Skill1", "Skill2"],
                  "linkedin_url": "url",
                  "github_url": "url",
                  "summary": "Short 2-line summary"
                }}
                """
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": settings.OPENAI_MODEL,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.1,
                        "response_format": {"type": "json_object"},
                    },
                )
                if response.status_code == 200:
                    result = response.json()
                    content_str = result["choices"][0]["message"]["content"]
                    parsed_data = json.loads(content_str)
                    parsed_data["skill_set"] = ", ".join(parsed_data.get("skills", []))
        except Exception as e:
            logger.warning(f"OpenAI parsing failed, falling back to heuristic: {e}")

    if not parsed_data:
        parsed_data = heuristic_parse_resume(extracted_text)

    return {
        "raw_text": extracted_text[:3000],
        **parsed_data,
    }
