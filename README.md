# ScreenAI — Resume Screener

> AI-powered resume screening tool. Upload a resume + paste a job description → get an instant match score, skill gap analysis, and recruiter recommendations.

![Stack](https://img.shields.io/badge/Frontend-React_+_Vite-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![Stack](https://img.shields.io/badge/AI-Groq_(Llama_3.3)-F55036?style=flat-square)
![Stack](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Backend | FastAPI (Python 3.13) |
| AI | Groq API — Llama 3.3 70B |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Features

- **Resume upload** — drag & drop PDF or TXT
- **Match score** (0–100) with animated score ring
- **Skill gap analysis** — matched, partial, and missing skills
- **Strengths & gaps** breakdown
- **Recruiter recommendations** — actionable next steps
- **Analysis history** — all past screenings saved to Supabase
- **REST API** with auto-generated docs at `/docs`

---

## Project Structure

```
resume-screener/
├── frontend/                   # React app (Vite)
│   ├── src/
│   │   ├── components/         # DropZone, ScoreRing, Results
│   │   ├── hooks/              # useAnalysis
│   │   ├── lib/                # axios API client
│   │   ├── pages/              # HomePage, HistoryPage, AnalysisPage
│   │   └── main.jsx
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
│
├── backend/                    # FastAPI app
│   ├── app/
│   │   ├── routers/            # analyze.py — API route handlers
│   │   ├── services/           # groq_service, supabase_service, parser_service
│   │   ├── models/             # Pydantic schemas
│   │   ├── config.py           # Env var loading
│   │   └── main.py             # App entrypoint + CORS
│   ├── Procfile                # Railway/Render start command
│   ├── .env.example
│   └── requirements.txt
│
├── supabase_schema.sql         # Run once in Supabase SQL editor
└── README.md
```

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com) (free)
- A [Supabase](https://supabase.com) project (free)

---

### 1. Supabase Setup

Go to your Supabase project → SQL Editor → run this once:

```sql
create table analyses (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  score       integer not null check (score >= 0 and score <= 100),
  verdict     text,
  summary     text,
  result      jsonb not null,
  resume_name text,
  job_snippet text
);

create index analyses_created_at_idx on analyses (created_at desc);
```

---

### 2. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Then open .env and fill in your keys

# Start the server
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`  
Interactive API docs at: `http://localhost:8000/docs`

---

### 3. Frontend

```bash
cd frontend

npm install

cp .env.example .env.local
# Open .env.local and set VITE_API_URL=http://localhost:8000

npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Environment Variables

### Backend — `backend/.env`

```env
GROQ_API_KEY=gsk_your_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

> Get your Groq API key free at [console.groq.com](https://console.groq.com)  
> Get Supabase keys from Project Settings → API

### Frontend — `frontend/.env.local`

```env
VITE_API_URL=http://localhost:8000
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Analyze resume vs job description |
| `GET` | `/api/history` | Fetch recent analyses |
| `GET` | `/api/analysis/:id` | Fetch single analysis by ID |
| `GET` | `/health` | Health check |

Full interactive docs available at `/docs` when backend is running.

---

## Deployment

### Frontend → Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL` = your Railway backend URL
5. Deploy

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo, set **Root Directory** to `backend`
3. Add environment variables in the Railway dashboard:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `ALLOWED_ORIGINS` (your Vercel URL)
4. Railway auto-detects FastAPI and deploys

### Backend → Render (alternative, free tier)

- **Build command:** `pip install -r requirements.txt`
- **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

> After deploying both, update `ALLOWED_ORIGINS` on Railway to your final Vercel URL, then redeploy the backend.

---

## Built With

- [Groq](https://groq.com) — ultra-fast LLM inference (free tier)
- [Llama 3.3 70B](https://groq.com/models) — the AI model powering analysis
- [FastAPI](https://fastapi.tiangolo.com) — Python web framework
- [Supabase](https://supabase.com) — open source Firebase alternative
- [React](https://react.dev) + [Vite](https://vitejs.dev) — frontend