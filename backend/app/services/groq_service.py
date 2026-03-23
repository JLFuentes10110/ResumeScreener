import json
from groq import AsyncGroq
from app.config import get_settings
from app.models.schemas import AnalysisResult

SYSTEM_PROMPT = """You are an expert technical recruiter and resume analyst.
Analyze the provided resume against the job description and return ONLY valid JSON — no markdown, no preamble.

Return this exact shape:
{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence executive summary of the candidate's fit>",
  "matched_skills": ["skill1", "skill2"],
  "partial_skills": ["skill1"],
  "missing_skills": ["skill1"],
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2", "gap3"],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3",
    "Specific actionable recommendation 4"
  ],
  "experience_years": <integer>,
  "seniority_fit": "<Junior|Mid|Senior|Lead>",
  "verdict": "<Strong Match|Good Candidate|Partial Fit|Needs Work|Poor Match>"
}

Scoring guide: 90+ exceptional · 70-89 good · 50-69 marginal · <50 poor fit.
Be precise, honest, and constructive."""


def get_verdict(score: int) -> str:
    if score >= 80: return "Strong Match"
    if score >= 65: return "Good Candidate"
    if score >= 50: return "Partial Fit"
    if score >= 35: return "Needs Work"
    return "Poor Match"


async def analyze_resume(resume_text: str, job_description: str) -> AnalysisResult:
    settings = get_settings()
    client = AsyncGroq(api_key=settings.groq_api_key)

    user_prompt = f"RESUME:\n{resume_text}\n\nJOB DESCRIPTION:\n{job_description}"

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_prompt},
        ],
        max_tokens=1024,
        response_format={"type": "json_object"},  # enforces valid JSON output
        temperature=0.3,
    )

    raw = response.choices[0].message.content.strip()

    data = json.loads(raw)

    return AnalysisResult(
        score=data["score"],
        summary=data["summary"],
        matched_skills=data.get("matched_skills", []),
        partial_skills=data.get("partial_skills", []),
        missing_skills=data.get("missing_skills", []),
        strengths=data.get("strengths", []),
        gaps=data.get("gaps", []),
        recommendations=data.get("recommendations", []),
        experience_years=data.get("experience_years", 0),
        seniority_fit=data.get("seniority_fit", ""),
        verdict=data.get("verdict", get_verdict(data["score"])),
    )