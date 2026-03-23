from supabase import create_client, Client
from app.config import get_settings
from app.models.schemas import AnalysisResult, HistoryItem
from uuid import UUID
from functools import lru_cache


@lru_cache
def get_supabase() -> Client:
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_key)


async def save_analysis(
    result: AnalysisResult,
    resume_name: str | None = None,
    job_snippet: str | None = None,
) -> dict:
    db = get_supabase()

    row = {
        "score": result.score,
        "verdict": result.verdict,
        "summary": result.summary,
        "result": result.model_dump(),
        "resume_name": resume_name,
        "job_snippet": job_snippet[:120] if job_snippet else None,
    }

    response = db.table("analyses").insert(row).execute()
    return response.data[0]


async def get_history(limit: int = 20) -> list[HistoryItem]:
    db = get_supabase()

    response = (
        db.table("analyses")
        .select("id, created_at, score, verdict, resume_name, job_snippet")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )

    return [HistoryItem(**row) for row in response.data]


async def get_analysis_by_id(analysis_id: UUID) -> dict | None:
    db = get_supabase()

    response = (
        db.table("analyses")
        .select("*")
        .eq("id", str(analysis_id))
        .single()
        .execute()
    )

    return response.data
