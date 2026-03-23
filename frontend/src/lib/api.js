import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 60_000, // 60s — AI calls can take a moment
});

/**
 * Analyze a resume against a job description.
 * @param {File} resumeFile
 * @param {string} jobDescription
 * @returns {Promise<AnalyzeResponse>}
 */
export async function analyzeResume(resumeFile, jobDescription) {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("job_description", jobDescription);

  const { data } = await api.post("/api/analyze", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

/**
 * Fetch recent analysis history.
 * @param {number} limit
 * @returns {Promise<HistoryItem[]>}
 */
export async function fetchHistory(limit = 20) {
  const { data } = await api.get("/api/history", { params: { limit } });
  return data;
}

/**
 * Fetch a single analysis by ID.
 * @param {string} id
 */
export async function fetchAnalysis(id) {
  const { data } = await api.get(`/api/analysis/${id}`);
  return data;
}
