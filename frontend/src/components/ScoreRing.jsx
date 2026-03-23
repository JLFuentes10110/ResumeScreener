export function getScoreColor(score) {
  if (score >= 75) return "#2a7d4f";
  if (score >= 50) return "#b86b1a";
  return "#c84b2f";
}

export function getVerdict(score) {
  if (score >= 80) return "Strong Match";
  if (score >= 65) return "Good Candidate";
  if (score >= 50) return "Partial Fit";
  if (score >= 35) return "Needs Work";
  return "Poor Match";
}

export default function ScoreRing({ score }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <div className="score-ring-wrap">
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
        <circle fill="none" stroke="var(--cream)" strokeWidth="7" cx="44" cy="44" r={r} />
        <circle
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          cx="44" cy="44" r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="score-num" style={{ color }}>
        {score}
        <span className="score-pct">/ 100</span>
      </div>
    </div>
  );
}
