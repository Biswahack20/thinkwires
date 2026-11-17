import os
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException, status

from app.config import settings, logger
from app.api.auth import verify_service_auth
from app.schemas.resume import (
    ParsedResumeResponse,
    ResumeMatchRequest,
    ResumeMatchResponse,
)
from app.services.resume_parser import parse_resume_content
from app.services.match_scorer import calculate_match_score

router = APIRouter(
    prefix="/api/resume",
    tags=["Resume Parsing & ATS Matching"],
    dependencies=[Depends(verify_service_auth)],
)

ALLOWED_MAGIC_SIGNATURES = {
    ".pdf": b"%PDF-",
    ".docx": b"PK\x03\x04",
}

@router.post("/parse", response_model=ParsedResumeResponse)
async def parse_resume_endpoint(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
):
    """
    Parses resume from either an uploaded document (PDF/DOCX/TXT) or raw text.
    SEC-01: Removed arbitrary client-controlled file_path parameter.
    Validates file size (max 10MB) and file signatures against spoofing.
    """
    file_bytes = None
    filename = None

    if file:
        filename = os.path.basename(file.filename or "resume.pdf")
        file_bytes = await file.read()

        # Enforce file size limit
        if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
            logger.warning(f"Rejected oversized resume upload: {len(file_bytes)} bytes")
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Uploaded file exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB",
            )

        # Validate file signatures
        ext = os.path.splitext(filename)[1].lower()
        if ext in ALLOWED_MAGIC_SIGNATURES:
            expected_sig = ALLOWED_MAGIC_SIGNATURES[ext]
            if not file_bytes.startswith(expected_sig):
                logger.warning(f"Rejected invalid file signature for {filename}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid file signature: Content does not match expected {ext.upper()} format",
                )
        elif ext not in (".txt", ""):
            # Only allow PDF, DOCX, and TXT
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '{ext}'. Only PDF, DOCX, and TXT resumes are supported.",
            )

    parsed = await parse_resume_content(
        file_bytes=file_bytes,
        filename=filename,
        raw_text=raw_text,
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
