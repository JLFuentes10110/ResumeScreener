import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import AnalysisPage from "./pages/AnalysisPage";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --ink:       #0d0d0d;
    --paper:     #f5f0e8;
    --cream:     #ede8de;
    --accent:    #c84b2f;
    --accent2:   #2f6ec8;
    --muted:     #7a7469;
    --border:    #c8c2b4;
    --good:      #2a7d4f;
    --warn:      #b86b1a;
    --bad:       #c84b2f;
    --card-bg:   #faf7f2;
    --shadow:    0 2px 12px rgba(13,13,13,0.08);
    --shadow-lg: 0 8px 40px rgba(13,13,13,0.13);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--paper);
    color: var(--ink);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    min-height: 100vh;
  }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* Header */
  .header {
    border-bottom: 1.5px solid var(--border);
    padding: 18px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--paper);
    position: sticky; top: 0; z-index: 100;
  }

  .logo { display: flex; align-items: baseline; gap: 10px; text-decoration: none; }
  .logo-word { font-family: 'DM Serif Display', serif; font-size: 1.5rem; letter-spacing: -0.5px; color: var(--ink); }
  .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); display: inline-block; margin-bottom: 2px; }

  .nav { display: flex; align-items: center; gap: 24px; }
  .nav a {
    font-family: 'DM Mono', monospace; font-size: 0.65rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    transition: color 0.2s;
  }
  .nav a:hover, .nav a.active { color: var(--ink); }
  .badge {
    font-family: 'DM Mono', monospace; font-size: 0.65rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); border: 1px solid var(--border);
    padding: 2px 8px; border-radius: 2px;
  }

  /* Hero */
  .hero {
    padding: 56px 40px 40px; max-width: 900px;
    margin: 0 auto; width: 100%; text-align: center;
  }
  .hero-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 18px;
  }
  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    line-height: 1.12; letter-spacing: -1.5px;
    color: var(--ink); margin-bottom: 16px;
  }
  .hero-title em { font-style: italic; color: var(--accent); }
  .hero-sub { font-size: 1rem; color: var(--muted); max-width: 500px; margin: 0 auto; line-height: 1.7; }

  /* Steps */
  .steps { display: flex; justify-content: center; gap: 36px; margin-bottom: 36px; }
  .step { display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: 0.35; transition: opacity 0.3s; }
  .step.active { opacity: 1; }
  .step.done { opacity: 0.6; }
  .step-circle {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 0.72rem;
    color: var(--muted); background: var(--card-bg);
  }
  .step.active .step-circle { border-color: var(--accent); color: var(--accent); background: rgba(200,75,47,0.06); }
  .step.done .step-circle { background: var(--good); border-color: var(--good); color: white; }
  .step-text { font-size: 0.68rem; color: var(--muted); letter-spacing: 0.04em; }

  /* Main */
  .main { flex: 1; max-width: 1100px; margin: 0 auto; width: 100%; padding: 0 40px 80px; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }

  /* Cards */
  .card { background: var(--card-bg); border: 1.5px solid var(--border); border-radius: 6px; overflow: hidden; box-shadow: var(--shadow); }
  .card-header {
    padding: 16px 22px; border-bottom: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--cream);
  }
  .card-label { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .card-body { padding: 20px 22px; }
  .card-count { font-family: 'DM Mono', monospace; font-size: 0.65rem; }
  .card-count.good { color: var(--good); }
  .card-count.bad  { color: var(--bad);  }

  /* Dropzone */
  .dropzone {
    border: 2px dashed var(--border); border-radius: 4px;
    padding: 36px 20px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: transparent;
    display: flex; flex-direction: column; align-items: center;
    gap: 10px; min-height: 160px; justify-content: center;
  }
  .dropzone:hover, .dropzone.over { border-color: var(--accent); background: rgba(200,75,47,0.04); }
  .dropzone.has-file { border-style: solid; border-color: var(--good); background: rgba(42,125,79,0.04); }
  .drop-icon { font-size: 1.8rem; opacity: 0.5; }
  .drop-text { font-size: 0.85rem; color: var(--muted); line-height: 1.5; }
  .drop-text strong { color: var(--ink); font-weight: 500; }
  .file-name { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--good); margin-top: 4px; }
  .file-input { display: none; }

  /* Textarea */
  .jd-textarea {
    width: 100%; min-height: 180px; border: none; background: transparent;
    font-family: 'Outfit', sans-serif; font-size: 0.88rem;
    color: var(--ink); resize: vertical; outline: none; line-height: 1.7;
  }
  .jd-textarea::placeholder { color: var(--border); }

  /* Buttons */
  .btn-row { display: flex; justify-content: center; margin-top: 8px; }
  .btn-primary {
    background: var(--ink); color: var(--paper); border: none;
    padding: 14px 48px; font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; font-weight: 500; letter-spacing: 0.04em;
    cursor: pointer; border-radius: 3px; transition: all 0.2s;
    display: flex; align-items: center; gap: 10px;
  }
  .btn-primary:hover:not(:disabled) { background: var(--accent); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(200,75,47,0.3); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-reset {
    background: transparent; border: 1.5px solid var(--border);
    color: var(--muted); padding: 7px 18px;
    font-family: 'DM Mono', monospace; font-size: 0.65rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; border-radius: 3px; transition: all 0.2s;
  }
  .btn-reset:hover { border-color: var(--ink); color: var(--ink); }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 16px; height: 16px; border: 2px solid rgba(245,240,232,0.3);
    border-top-color: var(--paper); border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* Results */
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .results { animation: fadeUp 0.5s ease both; }
  .results-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1.5px solid var(--border);
  }
  .score-block { display: flex; align-items: center; gap: 20px; }
  .score-ring-wrap { position: relative; width: 88px; height: 88px; flex-shrink: 0; }
  .score-num {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif; font-size: 1.5rem; line-height: 1;
  }
  .score-pct { font-size: 0.55rem; font-family: 'DM Mono', monospace; color: var(--muted); letter-spacing: 0.05em; }
  .score-meta { display: flex; flex-direction: column; gap: 4px; }
  .score-verdict { font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-style: italic; }
  .score-tagline { font-size: 0.78rem; color: var(--muted); max-width: 220px; line-height: 1.5; }

  .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }

  /* Pills */
  .pill-list { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
  .pill { font-family: 'DM Mono', monospace; font-size: 0.68rem; padding: 4px 10px; border-radius: 2px; letter-spacing: 0.05em; }
  .pill-match   { background: rgba(42,125,79,0.1);  color: var(--good); border: 1px solid rgba(42,125,79,0.25); }
  .pill-gap     { background: rgba(200,75,47,0.1);  color: var(--bad);  border: 1px solid rgba(200,75,47,0.25); }
  .pill-partial { background: rgba(184,107,26,0.1); color: var(--warn); border: 1px solid rgba(184,107,26,0.25); }

  .sec-label {
    font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .sec-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .rec-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
  .rec-item {
    display: flex; gap: 12px; align-items: flex-start;
    font-size: 0.85rem; line-height: 1.6; color: var(--ink);
    padding: 10px 14px; background: var(--cream); border-radius: 4px;
    border-left: 3px solid var(--accent2);
  }
  .rec-num { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--accent2); font-weight: 500; min-width: 20px; margin-top: 2px; }

  .summary-box {
    background: var(--ink); color: var(--paper); border-radius: 5px;
    padding: 22px 26px; margin-bottom: 20px;
    font-size: 0.88rem; line-height: 1.8;
    font-family: 'Outfit', sans-serif; font-weight: 300;
    position: relative; overflow: hidden;
  }
  .summary-box::before {
    content: '"'; font-family: 'DM Serif Display', serif; font-size: 6rem;
    position: absolute; top: -20px; right: 20px; opacity: 0.08; line-height: 1;
  }

  .error-box {
    background: rgba(200,75,47,0.08); border: 1.5px solid rgba(200,75,47,0.3);
    border-radius: 5px; padding: 16px 20px;
    font-size: 0.85rem; color: var(--bad); margin-bottom: 16px;
  }

  .footer {
    border-top: 1px solid var(--border); padding: 16px 40px;
    text-align: center; font-family: 'DM Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--border);
  }

  @media (max-width: 700px) {
    .grid, .result-grid { grid-template-columns: 1fr; }
    .header, .hero, .main { padding-left: 20px; padding-right: 20px; }
    .hero { padding-top: 36px; }
    .steps { gap: 20px; }
  }
`;

function StepIndicator({ hasFile, hasJob, hasResult, isLoading }) {
  const step = hasResult ? 3 : isLoading ? 2 : 1;
  const labels = ["Upload", "Analyze", "Results"];
  return (
    <div className="steps">
      {labels.map((label, i) => (
        <div key={i} className={`step ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}>
          <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
          <span className="step-text">{label}</span>
        </div>
      ))}
    </div>
  );
}

function Header() {
  const loc = useLocation();
  return (
    <header className="header">
      <Link className="logo" to="/">
        <span className="logo-word">Screen</span>
        <span className="logo-dot" />
        <span className="logo-word">AI</span>
      </Link>
      <nav className="nav">
        <Link to="/" className={loc.pathname === "/" ? "active" : ""}>Analyze</Link>
        <Link to="/history" className={loc.pathname === "/history" ? "active" : ""}>History</Link>
        <span className="badge">Resume Intelligence</span>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <style>{STYLES}</style>
      <div className="app">
        <Header />
        <div className="hero">
          <div className="hero-eyebrow">Powered by Claude AI</div>
          <h1 className="hero-title">
            Know your fit<br />before the <em>interview.</em>
          </h1>
          <p className="hero-sub">
            Upload a resume and paste a job description. Get an instant AI-powered match score, skill gap analysis, and actionable recommendations.
          </p>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analysis/:id" element={<AnalysisPage />} />
        </Routes>

        <footer className="footer">
          ScreenAI · Resume Intelligence · Built with Claude AI
        </footer>
      </div>
    </BrowserRouter>
  );
}
