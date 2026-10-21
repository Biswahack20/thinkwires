from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form

from app.schemas.resume import (
    ParsedResumeResponse,
    ResumeMatchRequest,
    ResumeMatchResponse,
)
from app.services.resume_parser import parse_resume_content
from app.services.match_scorer import calculate_match_score

router = APIRouter(prefix="/api/resume", tags=["Resume Parsing & ATS Matching"])

@router.post("/parse", response_model=ParsedResumeResponse)
async def parse_resume_endpoint(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    file_path: Optional[str] = Form(None),
):
    """
    Parses resume from either an uploaded document (PDF/DOCX/TXT),
    a raw text string, or a local file path.
    """
    file_bytes = None
    filename = None
    if file:
        file_bytes = await file.read()
        filename = file.filename

    parsed = await parse_resume_content(
        file_bytes=file_bytes,
        filename=filename,
        raw_text=raw_text,
        file_path=file_path,
    )

    return ParsedResumeResponse(
        success=True,
        **parsed,
    )

@router.post("/match-score", response_model=ResumeMatchResponse)
async def calculate_match_score_endpoint(request: ResumeMatchRequest):
    """
    Computes candidate ATS Fit Score (0-100%) against job requisition
    using weighted dimensions per PRD Section 4.3.
    """
    return calculate_match_score(request)
