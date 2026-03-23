from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


# ── Request / Response schemas ────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    score: int = Field(..., ge=0, le=100)
    summary: str
    matched_skills: list[str] = Field(default_factory=list)
    partial_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    experience_years: int = 0
    seniority_fit: str = ""
    verdict: str = ""


class AnalyzeResponse(BaseModel):
    id: UUID
    result: AnalysisResult
    created_at: datetime


class HistoryItem(BaseModel):
    id: UUID
    created_at: datetime
    score: int
    verdict: str
    resume_name: Optional[str]
    job_snippet: Optional[str]


class HealthResponse(BaseModel):
    status: str
    version: str
