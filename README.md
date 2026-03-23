# ScreenAI — Resume Screener

AI-powered resume screening tool. Upload a resume + paste a job description → get an instant match score, skill gap analysis, and recruiter recommendations.

## Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI (Python)
- **AI**: Anthropic Claude API
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (frontend) + Railway or Render (backend)

---

## Project Structure

```
resume-screener/
├── frontend/               # React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # API client, utilities
│   │   ├── pages/          # Page-level components
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── backend/                # FastAPI app
│   ├── app/
│   │   ├── routers/        # Route handlers
│   │   ├── services/       # Business logic (Claude, Supabase)
│   │   ├── models/         # Pydantic schemas
│   │   └── main.py         # App entrypoint
│   ├── .env.example
│   └── requirements.txt
│
└── README.md
```

---

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # Fill in your keys
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install

cp .env.example .env.local      # Fill in backend URL
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Environment Variables

### Backend (`backend/.env`)
```
GROQ_API_KEY=gsk_...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env.local`)
```
VITE_API_URL=http://localhost:8000
```

---

## Supabase Setup

Run this SQL in your Supabase SQL editor:

```sql
create table analyses (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  score       integer not null,
  verdict     text,
  summary     text,
  result      jsonb not null,
  resume_name text,
  job_snippet text
);
```

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Set `VITE_API_URL` to your backend URL
4. Deploy

### Backend → Railway
1. Connect GitHub repo
2. Set root to `/backend`
3. Add env vars in Railway dashboard
4. Deploy — Railway auto-detects FastAPI via `requirements.txt`

Or use **Render** (free tier available):
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
