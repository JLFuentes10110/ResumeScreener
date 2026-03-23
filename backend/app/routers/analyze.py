from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.models.schemas import AnalyzeResponse, HistoryItem
from app.services.groq_service import analyze_resume
from app.services.supabase_service import save_analysis, get_history, get_analysis_by_id
from app.services.parser_service import extract_text
from uuid import UUID
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    resume: UploadFile = File(..., description="Resume file (PDF or TXT)"),
    job_description: str = Form(..., min_length=50, description="Job description text"),
):
    """
    Analyze a resume against a job description.
    Returns a match score, skill gaps, and recommendations.
    """
    # 1. Extract text from uploaded resume
    resume_text = await extract_text(resume)

    # 2. Call Claude API
    try:
        result = await analyze_resume(resume_text, job_description)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"AI parsing error: {e}")
    except Exception as e:
        logger.error(f"Claude API error: {e}")
        raise HTTPException(status_code=502, detail="AI service unavailable. Please try again.")

    # 3. Persist to Supabase
    try:
        saved = await save_analysis(
            result,
            resume_name=resume.filename,
            job_snippet=job_description,
        )
    except Exception as e:
        logger.error(f"Supabase save error: {e}")
        # Don't fail the request if DB write fails — still return result
        from datetime import datetime, timezone
        from uuid import uuid4
        saved = {"id": str(uuid4()), "created_at": datetime.now(timezone.utc).isoformat()}

    return AnalyzeResponse(
        id=saved["id"],
        result=result,
        created_at=saved["created_at"],
    )


@router.get("/history", response_model=list[HistoryItem])
async def history(limit: int = 20):
    """Return recent analysis history."""
    return await get_history(limit=min(limit, 100))


@router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: UUID):
    """Retrieve a single past analysis by ID."""
    data = await get_analysis_by_id(analysis_id)
    if not data:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return data
