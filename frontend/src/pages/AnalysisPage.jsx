import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAnalysis } from "../lib/api";
import Results from "../components/Results";

export default function AnalysisPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis(id)
      .then((raw) => {
        // Supabase stores result as jsonb — reshape to match AnalyzeResponse
        setData({ id: raw.id, result: raw.result, created_at: raw.created_at });
      })
      .catch((e) => setError(e?.response?.data?.detail || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="main" style={{ paddingTop: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <Link to="/history" style={{ fontFamily: "DM Mono, monospace", fontSize: "0.65rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          ← History
        </Link>
      </div>

      {loading && <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading…</p>}
      {error && <div className="error-box">⚠ {error}</div>}
      {data && <Results data={data} onReset={() => window.location.href = "/"} />}
    </div>
  );
}
