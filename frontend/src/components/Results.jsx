import ScoreRing, { getScoreColor, getVerdict } from "./ScoreRing";

function Pill({ type, children }) {
  return <span className={`pill pill-${type}`}>{children}</span>;
}

function RecItem({ index, children, accent }) {
  return (
    <li className="rec-item" style={accent ? { borderLeftColor: accent } : {}}>
      <span className="rec-num" style={accent ? { color: accent } : {}}>
        0{index + 1}
      </span>
      {children}
    </li>
  );
}

export default function Results({ data, onReset }) {
  const { result, created_at } = data;
  const color = getScoreColor(result.score);
  const verdict = result.verdict || getVerdict(result.score);

  return (
    <div className="results">
      {/* Header row */}
      <div className="results-header">
        <div className="score-block">
          <ScoreRing score={result.score} />
          <div className="score-meta">
            <span className="score-verdict" style={{ color }}>{verdict}</span>
            <span className="score-tagline">
              {result.experience_years} yr{result.experience_years !== 1 ? "s" : ""} exp
              {" · "}
              {result.seniority_fit} level fit
            </span>
            <span className="score-tagline" style={{ fontSize: "0.6rem", opacity: 0.6 }}>
              {new Date(created_at).toLocaleString()}
            </span>
          </div>
        </div>
        <button className="btn-reset" onClick={onReset}>↩ New Analysis</button>
      </div>

      {/* Summary */}
      <div className="summary-box">{result.summary}</div>

      {/* Skills grid */}
      <div className="result-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-label">Matched Skills</span>
            <span className="card-count good">{result.matched_skills?.length ?? 0}</span>
          </div>
          <div className="card-body">
            <div className="pill-list">
              {result.matched_skills?.map((s, i) => (
                <Pill key={i} type="match">✓ {s}</Pill>
              ))}
            </div>
            {result.partial_skills?.length > 0 && (
              <>
                <div style={{ marginTop: 14 }} />
                <div className="sec-label">Partial / Transferable</div>
                <div className="pill-list">
                  {result.partial_skills.map((s, i) => (
                    <Pill key={i} type="partial">~ {s}</Pill>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-label">Missing Skills / Gaps</span>
            <span className="card-count bad">{result.missing_skills?.length ?? 0}</span>
          </div>
          <div className="card-body">
            <div className="pill-list">
              {result.missing_skills?.map((s, i) => (
                <Pill key={i} type="gap">✕ {s}</Pill>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Gaps */}
      <div className="result-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-label">Key Strengths</span>
          </div>
          <div className="card-body">
            <ul className="rec-list">
              {result.strengths?.map((s, i) => (
                <RecItem key={i} index={i} accent="var(--good)">{s}</RecItem>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-label">Notable Gaps</span>
          </div>
          <div className="card-body">
            <ul className="rec-list">
              {result.gaps?.map((g, i) => (
                <RecItem key={i} index={i} accent="var(--bad)">{g}</RecItem>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-label">Recruiter Recommendations</span>
          <span style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "DM Mono, monospace" }}>
            Actionable next steps
          </span>
        </div>
        <div className="card-body">
          <ul className="rec-list">
            {result.recommendations?.map((r, i) => (
              <RecItem key={i} index={i}>{r}</RecItem>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
