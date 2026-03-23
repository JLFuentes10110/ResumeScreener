import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DropZone from "../components/DropZone";
import Results from "../components/Results";
import { useAnalysis } from "../hooks/useAnalysis";

export default function HomePage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const { loading, result, error, analyze, reset } = useAnalysis();
  const navigate = useNavigate();

  const canSubmit = resumeFile && jobDesc.trim().length > 40 && !loading;

  async function handleSubmit() {
    await analyze(resumeFile, jobDesc);
  }

  function handleReset() {
    reset();
    setResumeFile(null);
    setJobDesc("");
  }

  if (result) {
    return (
      <div className="main" style={{ paddingTop: 8 }}>
        <Results data={result} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="main">
      {error && <div className="error-box">⚠ {error}</div>}

      <div className="grid">
        {/* Resume Upload */}
        <div className="card">
          <div className="card-header">
            <span className="card-label">01 — Resume</span>
            {resumeFile && (
              <span style={{ fontSize: "0.65rem", color: "var(--good)", fontFamily: "DM Mono, monospace" }}>
                Ready
              </span>
            )}
          </div>
          <div className="card-body">
            <DropZone label="resume" file={resumeFile} onFile={setResumeFile} />
          </div>
        </div>

        {/* Job Description */}
        <div className="card">
          <div className="card-header">
            <span className="card-label">02 — Job Description</span>
            {jobDesc.length > 40 && (
              <span style={{ fontSize: "0.65rem", color: "var(--good)", fontFamily: "DM Mono, monospace" }}>
                {jobDesc.length} chars
              </span>
            )}
          </div>
          <div className="card-body">
            <textarea
              className="jd-textarea"
              placeholder="Paste the job description here — include responsibilities, required skills, qualifications…"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="btn-row">
        <button className="btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
          {loading ? (
            <><div className="spinner" /> Analyzing Resume…</>
          ) : (
            <><span>⚡</span> Analyze Match</>
          )}
        </button>
      </div>
    </div>
  );
}
