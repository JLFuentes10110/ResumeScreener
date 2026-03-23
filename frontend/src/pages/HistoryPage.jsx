import { useEffect, useState } from "react";
import { fetchHistory } from "../lib/api";
import { getScoreColor, getVerdict } from "../components/ScoreRing";
import { Link } from "react-router-dom";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory(50)
      .then(setItems)
      .catch((e) => setError(e?.response?.data?.detail || e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main" style={{ paddingTop: 32 }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "baseline", gap: 16 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", letterSpacing: "-0.5px" }}>
          Analysis History
        </h2>
        <Link to="/" style={{ fontFamily: "DM Mono, monospace", fontSize: "0.65rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          ← New Analysis
        </Link>
      </div>

      {loading && <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading…</p>}
      {error && <div className="error-box">⚠ {error}</div>}

      {!loading && items.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No analyses yet. Run your first one!</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => {
          const color = getScoreColor(item.score);
          const verdict = item.verdict || getVerdict(item.score);
          return (
            <Link
              key={item.id}
              to={`/analysis/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="card" style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-lg)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow)"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 22px" }}>
                  {/* Score badge */}
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    border: `3px solid ${color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.1rem",
                    color,
                  }}>
                    {item.score}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--ink)" }}>
                        {item.resume_name || "Resume"}
                      </span>
                      <span style={{
                        fontFamily: "DM Mono, monospace", fontSize: "0.62rem",
                        padding: "2px 8px", borderRadius: 2,
                        background: `${color}18`, color, border: `1px solid ${color}44`,
                      }}>
                        {verdict}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.job_snippet || "—"}
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: "var(--muted)", flexShrink: 0 }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
